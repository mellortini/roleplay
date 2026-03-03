import api from './api';
import { Character } from '../types';

export interface CreateCharacterData {
  name: string;
  description: string;
  backstory: string;
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  strength?: number;
  agility?: number;
  intelligence?: number;
  charisma?: number;
}

export const charactersApi = {
  getAll: async (): Promise<Character[]> => {
    const response = await api.get('/characters');
    return response.data;
  },

  getById: async (id: string): Promise<Character> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  create: async (data: CreateCharacterData): Promise<Character> => {
    const response = await api.post('/characters', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCharacterData>): Promise<Character> => {
    const response = await api.put(`/characters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/characters/${id}`);
  },

  generate: async (theme?: string): Promise<{
    name: string;
    description: string;
    backstory: string;
    personality: string;
    stats: {
      health: number;
      maxHealth: number;
      mana: number;
      maxMana: number;
      strength: number;
      agility: number;
      intelligence: number;
      charisma: number;
    };
  }> => {
    const response = await api.post('/characters/generate', { theme });
    return response.data;
  },

  uploadAvatar: async (id: string, file: File): Promise<Character> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`/characters/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
