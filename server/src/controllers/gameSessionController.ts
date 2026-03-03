import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types';
import { z } from 'zod';
import { GameMode, GameStatus } from '@prisma/client';

const createSessionSchema = z.object({
  name: z.string().min(1, 'Nazwa sesji jest wymagana').max(100),
  description: z.string().max(500),
  gameMode: z.enum(['TURN_BASED', 'REAL_TIME']).default('TURN_BASED'),
  maxPlayers: z.number().min(2).max(10).default(4),
  storyContext: z.string().max(2000),
});

export class GameSessionController {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const sessions = await prisma.gameSession.findMany({
      where: {
        status: {
          in: ['WAITING', 'IN_PROGRESS'],
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(sessions);
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            character: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
          include: {
            character: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        npcs: true,
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Sesja nie została znaleziona' });
      return;
    }

    res.json(session);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = createSessionSchema.parse(req.body);

      const session = await prisma.gameSession.create({
        data: {
          ...data,
          creatorId: userId,
          status: 'WAITING',
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      throw error;
    }
  }

  async join(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const { characterId } = req.body;

    if (!characterId) {
      res.status(400).json({ error: 'ID postaci jest wymagane' });
      return;
    }

    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Sesja nie została znaleziona' });
      return;
    }

    if (session.status === 'FINISHED') {
      res.status(400).json({ error: 'Sesja została zakończona' });
      return;
    }

    if (session.participants.length >= session.maxPlayers) {
      res.status(400).json({ error: 'Sesja jest pełna' });
      return;
    }

    const existingParticipant = session.participants.find(
      (p) => p.userId === userId
    );

    if (existingParticipant) {
      res.status(409).json({ error: 'Już dołączyłeś do tej sesji' });
      return;
    }

    const character = await prisma.character.findFirst({
      where: { id: characterId, userId },
    });

    if (!character) {
      res.status(404).json({ error: 'Postać nie została znaleziona' });
      return;
    }

    const participant = await prisma.gameParticipant.create({
      data: {
        sessionId: id,
        userId,
        characterId,
        turnOrder: session.participants.length,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        character: true,
      },
    });

    res.status(201).json(participant);
  }

  async leave(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const participant = await prisma.gameParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: id,
          userId,
        },
      },
    });

    if (!participant) {
      res.status(404).json({ error: 'Nie jesteś uczestnikiem tej sesji' });
      return;
    }

    await prisma.gameParticipant.delete({
      where: { id: participant.id },
    });

    res.status(204).send();
  }

  async start(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Sesja nie została znaleziona' });
      return;
    }

    if (session.creatorId !== userId) {
      res.status(403).json({ error: 'Tylko twórca sesji może ją rozpocząć' });
      return;
    }

    if (session.status !== 'WAITING') {
      res.status(400).json({ error: 'Sesja już się rozpoczęła' });
      return;
    }

    if (session.participants.length < 1) {
      res.status(400).json({ error: 'Potrzebny jest co najmniej jeden gracz' });
      return;
    }

    const updatedSession = await prisma.gameSession.update({
      where: { id },
      data: { status: 'IN_PROGRESS', currentTurn: 0 },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            character: true,
          },
        },
      },
    });

    res.json(updatedSession);
  }

  async end(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const session = await prisma.gameSession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({ error: 'Sesja nie została znaleziona' });
      return;
    }

    if (session.creatorId !== userId) {
      res.status(403).json({ error: 'Tylko twórca sesji może ją zakończyć' });
      return;
    }

    const updatedSession = await prisma.gameSession.update({
      where: { id },
      data: { status: 'FINISHED' },
    });

    res.json(updatedSession);
  }
}

export const gameSessionController = new GameSessionController();
