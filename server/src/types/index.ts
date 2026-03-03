import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

// Socket events
export interface ServerToClientEvents {
  'game:message': (message: GameMessagePayload) => void;
  'game:state': (state: GameStatePayload) => void;
  'game:playerJoined': (player: PlayerInfo) => void;
  'game:playerLeft': (playerId: string) => void;
  'game:turnChanged': (turnData: TurnData) => void;
  'game:actionResult': (result: ActionResult) => void;
  'error': (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  'game:join': (data: { sessionId: string; characterId: string }) => void;
  'game:leave': (data: { sessionId: string }) => void;
  'game:action': (data: ActionPayload) => void;
  'game:chat': (data: { sessionId: string; message: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}

// Game payloads
export interface GameMessagePayload {
  id: string;
  type: 'CHAT' | 'ACTION' | 'NARRATION' | 'SYSTEM' | 'NPC_DIALOGUE' | 'COMBAT';
  content: string;
  author?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

export interface GameStatePayload {
  sessionId: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED';
  currentTurn: number;
  participants: PlayerInfo[];
}

export interface PlayerInfo {
  id: string;
  username: string;
  character: {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    level: number;
  };
  isActive: boolean;
  isCurrentTurn: boolean;
}

export interface TurnData {
  currentPlayerIndex: number;
  totalPlayers: number;
  timeRemaining?: number;
}

export interface ActionPayload {
  sessionId: string;
  action: string;
  target?: string;
  params?: Record<string, unknown>;
}

export interface ActionResult {
  success: boolean;
  message: string;
  effects?: {
    damage?: number;
    healing?: number;
    experience?: number;
    items?: string[];
  };
}

// AI
export interface AIResponse {
  content: string;
  type: 'narration' | 'dialogue' | 'combat';
}
