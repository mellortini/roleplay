import api from './api';
import { GameSession, GameMode } from '../types';

export interface CreateSessionData {
  name: string;
  description: string;
  gameMode?: GameMode;
  maxPlayers?: number;
  storyContext: string;
}

export const gameSessionsApi = {
  getAll: async (): Promise<GameSession[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  getById: async (id: string): Promise<GameSession> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (data: CreateSessionData): Promise<GameSession> => {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  join: async (sessionId: string, characterId: string): Promise<unknown> => {
    const response = await api.post(`/sessions/${sessionId}/join`, { characterId });
    return response.data;
  },

  leave: async (sessionId: string): Promise<void> => {
    await api.post(`/sessions/${sessionId}/leave`);
  },

  start: async (sessionId: string): Promise<GameSession> => {
    const response = await api.post(`/sessions/${sessionId}/start`);
    return response.data;
  },

  end: async (sessionId: string): Promise<GameSession> => {
    const response = await api.post(`/sessions/${sessionId}/end`);
    return response.data;
  },
};
