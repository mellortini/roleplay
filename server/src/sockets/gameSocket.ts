import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';
import { aiService } from '../services/aiService';
import { aiRateLimiter } from '../services/rateLimiter';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  TokenPayload,
} from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store for session state in memory (optimization - avoids DB writes on every action)
// Reserved for future optimization
// interface SessionState {
//   lastSnapshot: number;
//   pendingChanges: boolean;
// }
// const _sessionStates: Map<string, SessionState> = new Map();

export class GameSocketHandler {
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private activeSessions: Map<string, Set<string>> = new Map(); // sessionId -> Set of socketIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('Brak tokenu autentykacji'));
        }

        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

        socket.data.userId = decoded.userId;
        socket.data.username = decoded.username;

        next();
      } catch (error) {
        next(new Error('Nieprawidłowy token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Użytkownik połączony: ${socket.data.username} (${socket.id})`);

      // Dołączenie do sesji gry
      socket.on('game:join', async (data) => {
        try {
          const { sessionId, characterId } = data;
          const userId = socket.data.userId;

          // Sprawdź czy użytkownik jest uczestnikiem sesji
          const participant = await prisma.gameParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId,
                userId,
              },
            },
            include: {
              character: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          });

          if (!participant) {
            socket.emit('error', { message: 'Nie jesteś uczestnikiem tej sesji' });
            return;
          }

          if (participant.characterId !== characterId) {
            socket.emit('error', { message: 'Nieprawidłowa postać' });
            return;
          }

          // Dołącz do pokoju Socket.io
          socket.join(sessionId);

          // Dodaj do aktywnych sesji
          if (!this.activeSessions.has(sessionId)) {
            this.activeSessions.set(sessionId, new Set());
          }
          this.activeSessions.get(sessionId)!.add(socket.id);

          // Powiadom innych graczy
          socket.to(sessionId).emit('game:playerJoined', {
            id: userId,
            username: participant.user.username,
            character: {
              id: participant.character.id,
              name: participant.character.name,
              health: participant.character.health,
              maxHealth: participant.character.maxHealth,
              level: participant.character.level,
            },
            isActive: true,
            isCurrentTurn: false,
          });

          // Wyślij obecny stan gry
          const session = await prisma.gameSession.findUnique({
            where: { id: sessionId },
            include: {
              participants: {
                include: {
                  character: true,
                  user: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
            },
          });

          if (session) {
            socket.emit('game:state', {
              sessionId,
              status: session.status,
              currentTurn: session.currentTurn,
              participants: session.participants.map((p: typeof session.participants[0], index: number) => ({
                id: p.user.id,
                username: p.user.username,
                character: {
                  id: p.character.id,
                  name: p.character.name,
                  health: p.character.health,
                  maxHealth: p.character.maxHealth,
                  level: p.character.level,
                },
                isActive: p.isActive,
                isCurrentTurn: index === session.currentTurn,
              })),
            });
          }

          console.log(`${socket.data.username} dołączył do sesji ${sessionId}`);
        } catch (error) {
          console.error('Błąd przy dołączaniu do sesji:', error);
          socket.emit('error', { message: 'Błąd przy dołączaniu do sesji' });
        }
      });

      // Opuszczenie sesji gry
      socket.on('game:leave', async (data) => {
        const { sessionId } = data;

        socket.leave(sessionId);

        if (this.activeSessions.has(sessionId)) {
          this.activeSessions.get(sessionId)!.delete(socket.id);
        }

        this.io.to(sessionId).emit('game:playerLeft', socket.data.userId);

        console.log(`${socket.data.username} opuścił sesję ${sessionId}`);
      });

      // Akcja gracza
      socket.on('game:action', async (data) => {
        try {
          const { sessionId, action, target, params } = data;
          const userId = socket.data.userId;

          // Sprawdź czy użytkownik jest uczestnikiem sesji
          const participant = await prisma.gameParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId,
                userId,
              },
            },
            include: {
              character: true,
            },
          });

          if (!participant) {
            socket.emit('error', { message: 'Nie jesteś uczestnikiem tej sesji' });
            return;
          }

          // Pobierz sesję
          const session = await prisma.gameSession.findUnique({
            where: { id: sessionId },
          });

          if (!session || session.status !== 'IN_PROGRESS') {
            socket.emit('error', { message: 'Sesja nie jest aktywna' });
            return;
          }

          // Sprawdź czy to kolej gracza (tylko dla trybu turowego)
          if (session.gameMode === 'TURN_BASED') {
            const participants = await prisma.gameParticipant.findMany({
              where: { sessionId },
              orderBy: { turnOrder: 'asc' },
            });

            const currentParticipant = participants[session.currentTurn];
            if (currentParticipant.userId !== userId) {
              socket.emit('error', { message: 'Nie twoja kolej' });
              return;
            }
          }

          // Zapisz akcję jako wiadomość
          const message = await prisma.gameMessage.create({
            data: {
              sessionId,
              characterId: participant.characterId,
              type: 'ACTION',
              content: `${participant.character.name} wykonuje akcję: ${action}`,
              action,
              metadata: { target, params },
            },
            include: {
              character: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          // Wyślij wiadomość do wszystkich w sesji
          this.io.to(sessionId).emit('game:message', {
            id: message.id,
            type: message.type,
            content: message.content,
            author: message.character
              ? {
                  id: message.character.id,
                  name: message.character.name,
                }
              : undefined,
            timestamp: message.createdAt.toISOString(),
          });

          // Generuj odpowiedź NPC/narrację przez AI
          await this.processAction(sessionId, action, participant.character, target, params);

          // Przejdź do następnej tury (tylko dla trybu turowego)
          if (session.gameMode === 'TURN_BASED') {
            const participants = await prisma.gameParticipant.findMany({
              where: { sessionId },
              orderBy: { turnOrder: 'asc' },
            });

            const nextTurn = (session.currentTurn + 1) % participants.length;

            await prisma.gameSession.update({
              where: { id: sessionId },
              data: { currentTurn: nextTurn },
            });

            this.io.to(sessionId).emit('game:turnChanged', {
              currentPlayerIndex: nextTurn,
              totalPlayers: participants.length,
            });
          }

          // Wyślij wynik akcji
          socket.emit('game:actionResult', {
            success: true,
            message: 'Akcja wykonana pomyślnie',
          });
        } catch (error) {
          console.error('Błąd przy wykonywaniu akcji:', error);
          socket.emit('error', { message: 'Błąd przy wykonywaniu akcji' });
        }
      });

      // Wiadomość czatu
      socket.on('game:chat', async (data) => {
        try {
          const { sessionId, message: content } = data;
          const userId = socket.data.userId;

          const participant = await prisma.gameParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId,
                userId,
              },
            },
            include: {
              character: true,
            },
          });

          if (!participant) {
            socket.emit('error', { message: 'Nie jesteś uczestnikiem tej sesji' });
            return;
          }

          const message = await prisma.gameMessage.create({
            data: {
              sessionId,
              characterId: participant.characterId,
              type: 'CHAT',
              content,
            },
            include: {
              character: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          this.io.to(sessionId).emit('game:message', {
            id: message.id,
            type: message.type,
            content: message.content,
            author: message.character
              ? {
                  id: message.character.id,
                  name: message.character.name,
                }
              : undefined,
            timestamp: message.createdAt.toISOString(),
          });
        } catch (error) {
          console.error('Błąd przy wysyłaniu wiadomości:', error);
          socket.emit('error', { message: 'Błąd przy wysyłaniu wiadomości' });
        }
      });

      // Rozłączenie
      socket.on('disconnect', () => {
        console.log(`Użytkownik rozłączony: ${socket.data.username} (${socket.id})`);

        // Usuń z aktywnych sesji
        this.activeSessions.forEach((sockets, sessionId) => {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);
            this.io.to(sessionId).emit('game:playerLeft', socket.data.userId);
          }
        });
      });
    });
  }

  private async processAction(
    sessionId: string,
    action: string,
    character: { id: string; name: string },
    target?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params?: Record<string, unknown>
  ): Promise<void> {
    try {
      // Rate limiting dla AI - max 10 zapytań na minutę na sesję
      if (!aiRateLimiter.canProceed(sessionId)) {
        // Jeśli limit przekroczony, wyślij fallback response
        const fallbackMessage = await prisma.gameMessage.create({
          data: {
            sessionId,
            type: 'NARRATION',
            content: 'Scena rozwija się dalej... (limit zapytań do AI przekroczony, poczekaj chwilę)',
            isAiGenerated: true,
          },
        });

        this.io.to(sessionId).emit('game:message', {
          id: fallbackMessage.id,
          type: fallbackMessage.type,
          content: fallbackMessage.content,
          timestamp: fallbackMessage.createdAt.toISOString(),
        });
        return;
      }

      // Pobierz ostatnie wiadomości jako kontekst
      const recentMessages = await prisma.gameMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          character: {
            select: {
              name: true,
            },
          },
        },
      });

      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) return;

      // Sprawdź czy akcja jest skierowana do NPC
      let aiResponse: { content: string; type: 'narration' | 'dialogue' | 'combat' } | null = null;

      if (target) {
        const npc = await prisma.nPCCharacter.findFirst({
          where: {
            sessionId,
            name: {
              contains: target,
              mode: 'insensitive',
            },
          },
        });

        if (npc) {
          // Generuj odpowiedź NPC
          aiResponse = await aiService.generateNPCResponse({
            npcName: npc.name,
            npcDescription: npc.description,
            npcPersonality: npc.personality,
            playerAction: action,
            playerName: character.name,
            storyContext: session.storyContext,
            previousMessages: recentMessages
              .reverse()
              .map((m: typeof recentMessages[0]) => `${m.character?.name || 'Narrator'}: ${m.content}`),
          });
        }
      }

      // Jeśli nie ma NPC lub nie wygenerowano odpowiedzi, wygeneruj narrację
      if (!aiResponse) {
        aiResponse = await aiService.generateNarration({
          storyContext: session.storyContext,
          playerActions: [`${character.name} wykonuje akcję: ${action}`],
          currentScene: 'Aktualna scena',
        });
      }

      // Zapisz odpowiedź AI jako wiadomość (z flagą isAiGenerated)
      if (!aiResponse) {
        return;
      }
      
      const aiMessage = await prisma.gameMessage.create({
        data: {
          sessionId,
          type: aiResponse.type === 'dialogue' ? 'NPC_DIALOGUE' : 'NARRATION',
          content: aiResponse.content,
          isAiGenerated: true,
        },
      });

      // Wyślij do wszystkich graczy
      this.io.to(sessionId).emit('game:message', {
        id: aiMessage.id,
        type: aiMessage.type,
        content: aiMessage.content,
        timestamp: aiMessage.createdAt.toISOString(),
      });
    } catch (error) {
      console.error('Błąd przy przetwarzaniu akcji:', error);
    }
  }
}

export default GameSocketHandler;
