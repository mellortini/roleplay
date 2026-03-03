import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import path from 'path';

import authRoutes from './routes/auth';
import characterRoutes from './routes/characters';
import gameSessionRoutes from './routes/gameSessions';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import GameSocketHandler from './sockets/gameSocket';

const app = express();
const server = createServer(app);

// Rate limiting dla API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // 100 zapytań na 15 minut
  message: { error: 'Zbyt wiele zapytań, spróbuj ponownie później' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting dla AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuta
  max: 10, // 10 zapytań na minutę
  message: { error: 'Zbyt wiele zapytań do AI. Poczekaj chwilę.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/api/', apiLimiter);

// Statyczne pliki (uploady)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes (AI endpoints mają osobny rate limit)
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/sessions', gameSessionRoutes);

// AI routes with stricter rate limiting
app.use('/api/ai', aiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.io
const gameSocketHandler = new GameSocketHandler(server);

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
