import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  SocketMessage, 
  GameState, 
  PlayerInfo 
} from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);

  const connect = useCallback((token: string) => {
    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to game server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from game server');
      setIsConnected(false);
    });

    socketRef.current.on('game:message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('game:state', (state) => {
      setGameState(state);
      setPlayers(state.participants);
    });

    socketRef.current.on('game:playerJoined', (player) => {
      setPlayers((prev) => [...prev, player]);
    });

    socketRef.current.on('game:playerLeft', (playerId) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    });

    socketRef.current.on('game:turnChanged', (turnData) => {
      setCurrentTurn(turnData.currentPlayerIndex);
      setPlayers((prev) =>
        prev.map((p, index) => ({
          ...p,
          isCurrentTurn: index === turnData.currentPlayerIndex,
        }))
      );
    });

    socketRef.current.on('game:actionResult', (result) => {
      console.log('Action result:', result);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setMessages([]);
    setGameState(null);
    setPlayers([]);
  }, []);

  const joinGame = useCallback((sessionId: string, characterId: string) => {
    socketRef.current?.emit('game:join', { sessionId, characterId });
  }, []);

  const leaveGame = useCallback((sessionId: string) => {
    socketRef.current?.emit('game:leave', { sessionId });
  }, []);

  const sendAction = useCallback((
    sessionId: string, 
    action: string, 
    target?: string, 
    params?: Record<string, unknown>
  ) => {
    socketRef.current?.emit('game:action', { sessionId, action, target, params });
  }, []);

  const sendChat = useCallback((sessionId: string, message: string) => {
    socketRef.current?.emit('game:chat', { sessionId, message });
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    messages,
    gameState,
    players,
    currentTurn,
    connect,
    disconnect,
    joinGame,
    leaveGame,
    sendAction,
    sendChat,
  };
};
