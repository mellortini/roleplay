import { Response } from 'express';
import prisma from '../services/prisma';
import { aiService } from '../services/aiService';
import { characterGenRateLimiter } from '../services/rateLimiter';
import { AuthenticatedRequest } from '../types';
import { z } from 'zod';

const createCharacterSchema = z.object({
  name: z.string().min(1, 'Imię jest wymagane').max(50, 'Imię może mieć maksymalnie 50 znaków'),
  description: z.string().max(500, 'Opis może mieć maksymalnie 500 znaków'),
  backstory: z.string().max(1000, 'Historia może mieć maksymalnie 1000 znaków'),
  avatarUrl: z.string().optional(),
  health: z.number().min(10).max(200).default(100),
  maxHealth: z.number().min(10).max(200).default(100),
  mana: z.number().min(0).max(100).default(50),
  maxMana: z.number().min(0).max(100).default(50),
  strength: z.number().min(1).max(20).default(10),
  agility: z.number().min(1).max(20).default(10),
  intelligence: z.number().min(1).max(20).default(10),
  charisma: z.number().min(1).max(20).default(10),
});

export class CharacterController {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const characters = await prisma.character.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(characters);
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const character = await prisma.character.findFirst({
      where: { id, userId },
    });

    if (!character) {
      res.status(404).json({ error: 'Postać nie została znaleziona' });
      return;
    }

    res.json(character);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = createCharacterSchema.parse(req.body);

      const character = await prisma.character.create({
        data: {
          ...data,
          userId,
        },
      });

      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      throw error;
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = createCharacterSchema.partial().parse(req.body);

      const existingCharacter = await prisma.character.findFirst({
        where: { id, userId },
      });

      if (!existingCharacter) {
        res.status(404).json({ error: 'Postać nie została znaleziona' });
        return;
      }

      const character = await prisma.character.update({
        where: { id },
        data,
      });

      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      throw error;
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingCharacter = await prisma.character.findFirst({
      where: { id, userId },
    });

    if (!existingCharacter) {
      res.status(404).json({ error: 'Postać nie została znaleziona' });
      return;
    }

    await prisma.character.delete({
      where: { id },
    });

    res.status(204).send();
  }

  async generate(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { theme } = req.body;

    // Rate limiting - 5 generowań na minutę na użytkownika
    if (!characterGenRateLimiter.canProceed(userId)) {
      const timeToReset = Math.ceil(characterGenRateLimiter.getTimeToReset(userId) / 1000);
      res.status(429).json({ 
        error: `Zbyt wiele zapytań. Poczekaj ${timeToReset} sekund.` 
      });
      return;
    }

    try {
      const generatedCharacter = await aiService.generateCharacter(theme);

      res.json({
        ...generatedCharacter,
        stats: {
          health: 100,
          maxHealth: 100,
          mana: 50,
          maxMana: 50,
          strength: Math.floor(Math.random() * 10) + 5,
          agility: Math.floor(Math.random() * 10) + 5,
          intelligence: Math.floor(Math.random() * 10) + 5,
          charisma: Math.floor(Math.random() * 10) + 5,
        },
      });
    } catch (error) {
      console.error('Generate character error:', error);
      res.status(500).json({ error: 'Nie udało się wygenerować postaci' });
    }
  }

  async uploadAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // Sprawdź czy postać należy do użytkownika
      const character = await prisma.character.findFirst({
        where: { id, userId },
      });

      if (!character) {
        res.status(404).json({ error: 'Postać nie została znaleziona' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'Nie przesłano pliku' });
        return;
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      const updatedCharacter = await prisma.character.update({
        where: { id },
        data: { avatarUrl },
      });

      res.json(updatedCharacter);
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ error: 'Nie udało się przesłać awatara' });
    }
  }
}

export const characterController = new CharacterController();
