export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  description: string;
  backstory: string;
  avatarUrl?: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  level: number;
  experience: number;
  inventory: unknown[];
  skills: unknown[];
  createdAt: string;
  updatedAt: string;
}

export type GameMode = 'TURN_BASED' | 'REAL_TIME';
export type GameStatus = 'WAITING' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED';
export type MessageType = 'CHAT' | 'ACTION' | 'NARRATION' | 'SYSTEM' | 'NPC_DIALOGUE' | 'COMBAT';

export interface GameSession {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creator: {
    id: string;
    username: string;
  };
  gameMode: GameMode;
  maxPlayers: number;
  status: GameStatus;
  storyContext: string;
  currentTurn: number;
  participants: GameParticipant[];
  messages: GameMessage[];
  npcs: NPCCharacter[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    participants: number;
  };
}

export interface GameParticipant {
  id: string;
  sessionId: string;
  userId: string;
  user: {
    id: string;
    username: string;
  };
  characterId: string;
  character: Character;
  joinedAt: string;
  isActive: boolean;
  turnOrder: number;
}

export interface GameMessage {
  id: string;
  sessionId: string;
  characterId?: string;
  character?: {
    id: string;
    name: string;
  };
  type: MessageType;
  content: string;
  action?: string;
  metadata?: unknown;
  createdAt: string;
}

export interface NPCCharacter {
  id: string;
  sessionId: string;
  name: string;
  description: string;
  personality: string;
  role: string;
  health: number;
  maxHealth: number;
  createdAt: string;
  updatedAt: string;
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

export interface GameState {
  sessionId: string;
  status: GameStatus;
  currentTurn: number;
  participants: PlayerInfo[];
}

export interface SocketMessage {
  id: string;
  type: MessageType;
  content: string;
  author?: {
    id: string;
    name: string;
  };
  timestamp: string;
  isAiGenerated?: boolean;
}

// Socket events
export interface ServerToClientEvents {
  'game:message': (message: SocketMessage) => void;
  'game:state': (state: GameState) => void;
  'game:playerJoined': (player: PlayerInfo) => void;
  'game:playerLeft': (playerId: string) => void;
  'game:turnChanged': (turnData: { currentPlayerIndex: number; totalPlayers: number; }) => void;
  'game:actionResult': (result: { success: boolean; message: string; }) => void;
  'error': (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  'game:join': (data: { sessionId: string; characterId: string }) => void;
  'game:leave': (data: { sessionId: string }) => void;
  'game:action': (data: { sessionId: string; action: string; target?: string; params?: Record<string, unknown> }) => void;
  'game:chat': (data: { sessionId: string; message: string }) => void;
}
