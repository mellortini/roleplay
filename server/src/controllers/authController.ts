import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../services/prisma';
import { generateToken } from '../middleware/auth';
import { AuthenticatedRequest, LoginCredentials, RegisterCredentials } from '../types';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  username: z.string().min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki').max(20, 'Nazwa użytkownika może mieć maksymalnie 20 znaków'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        return;
      }

      const isValidPassword = await bcrypt.compare(data.password, user.password);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        return;
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      throw error;
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);

      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        res.status(409).json({ error: 'Użytkownik z tym adresem email już istnieje' });
        return;
      }

      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUsername) {
        res.status(409).json({ error: 'Nazwa użytkownika jest już zajęta' });
        return;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      throw error;
    }
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Nieautoryzowany' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }
}

export const authController = new AuthController();
