import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gameSessionsApi } from '../services/gameSessions';
import { GameSession } from '../types';

export const Lobby = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await gameSessionsApi.getAll();
      setSessions(data);
    } catch {
      setError('Nie udało się załadować sesji');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: GameSession['status']) => {
    switch (status) {
      case 'WAITING':
        return { text: 'Oczekuje', color: 'text-yellow-400' };
      case 'IN_PROGRESS':
        return { text: 'W trakcie', color: 'text-green-400' };
      case 'PAUSED':
        return { text: 'Wstrzymana', color: 'text-orange-400' };
      case 'FINISHED':
        return { text: 'Zakończona', color: 'text-gray-400' };
    }
  };

  const getGameModeLabel = (mode: GameSession['gameMode']) => {
    return mode === 'TURN_BASED' ? 'Turowy' : 'Real-time';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-primary-400 text-lg">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Lobby</h1>
        <Link to="/sessions/create" className="btn-primary">
          Utwórz nową sesję
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg mb-4">Brak aktywnych sesji</p>
          <p className="text-gray-500 mb-6">
            Bądź pierwszy i utwórz nową sesję gry!
          </p>
          <Link to="/sessions/create" className="btn-primary">
            Utwórz sesję
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const status = getStatusLabel(session.status);
            return (
              <Link
                key={session.id}
                to={`/sessions/${session.id}`}
                className="card-hover"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {session.name}
                  </h3>
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {session.description || 'Brak opisu'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Twórca:</span>
                    <span className="text-gray-300">{session.creator.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tryb:</span>
                    <span className="text-gray-300">
                      {getGameModeLabel(session.gameMode)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gracze:</span>
                    <span className="text-gray-300">
                      {session._count?.participants || 0} / {session.maxPlayers}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
