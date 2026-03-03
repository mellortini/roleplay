import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameSessionsApi } from '../services/gameSessions';
import { charactersApi } from '../services/characters';
import { useSocket } from '../hooks/useSocket';
import { GameSession, Character, GameStatus } from '../types';
import { GameMessageComponent } from '../components/GameMessage';

export const GameRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  
  const [session, setSession] = useState<GameSession | null>(null);
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [actionInput, setActionInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    messages,
    players,
    currentTurn,
    connect,
    disconnect,
    joinGame,
    leaveGame,
    sendAction,
    sendChat,
  } = useSocket();

  useEffect(() => {
    loadSession();
    loadUserCharacters();
    
    return () => {
      if (id) {
        leaveGame(id);
      }
      disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (token) {
      connect(token);
    }
  }, [token, connect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const data = await gameSessionsApi.getById(id);
      setSession(data);
      
      // Check if user is already a participant
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isParticipant = data.participants.some(p => p.userId === payload.userId);
        setIsJoined(isParticipant);
        if (isParticipant) {
          setSelectedCharacter(data.participants.find(p => p.userId === payload.userId)?.characterId || '');
        }
      }
    } catch {
      setError('Nie udało się załadować sesji');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCharacters = async () => {
    try {
      const data = await charactersApi.getAll();
      setUserCharacters(data);
    } catch {
      // Error handled silently
    }
  };

  const handleJoin = async () => {
    if (!id || !selectedCharacter) return;

    try {
      await gameSessionsApi.join(id, selectedCharacter);
      joinGame(id, selectedCharacter);
      setIsJoined(true);
    } catch {
      setError('Nie udało się dołączyć do sesji');
    }
  };

  const handleLeave = async () => {
    if (!id) return;

    try {
      await gameSessionsApi.leave(id);
      leaveGame(id);
      setIsJoined(false);
      navigate('/lobby');
    } catch {
      setError('Nie udało się opuścić sesji');
    }
  };

  const handleStart = async () => {
    if (!id) return;

    try {
      await gameSessionsApi.start(id);
      loadSession();
    } catch {
      setError('Nie udało się rozpocząć sesji');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !chatInput.trim()) return;

    sendChat(id, chatInput);
    setChatInput('');
  };

  const handleSendAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !actionInput.trim()) return;

    sendAction(id, actionInput);
    setActionInput('');
  };

  const getStatusLabel = (status: GameStatus) => {
    switch (status) {
      case 'WAITING':
        return { text: 'Oczekuje na graczy', color: 'bg-yellow-900/50 text-yellow-300' };
      case 'IN_PROGRESS':
        return { text: 'W trakcie gry', color: 'bg-green-900/50 text-green-300' };
      case 'PAUSED':
        return { text: 'Wstrzymana', color: 'bg-orange-900/50 text-orange-300' };
      case 'FINISHED':
        return { text: 'Zakończona', color: 'bg-gray-800 text-gray-400' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-primary-400 text-lg">Ładowanie...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="card text-center py-16">
        <p className="text-gray-400">Sesja nie została znaleziona</p>
      </div>
    );
  }

  const status = getStatusLabel(session.status);
  const isCreator = session.creatorId === (token ? JSON.parse(atob(token.split('.')[1])).userId : '');

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{session.name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
              {status.text}
            </span>
            <span className="text-gray-400 text-sm">
              Tryb: {session.gameMode === 'TURN_BASED' ? 'Turowy' : 'Real-time'}
            </span>
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '● Połączono' : '● Rozłączono'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {isCreator && session.status === 'WAITING' && (
            <button
              onClick={handleStart}
              className="btn-primary"
              disabled={session.participants.length === 0}
            >
              Rozpocznij grę
            </button>
          )}
          {isJoined && (
            <button onClick={handleLeave} className="btn-danger">
              Opuść sesję
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Sidebar with players */}
        <div className="card overflow-hidden">
          <h3 className="text-lg font-semibold text-white mb-4">Gracze</h3>
          <div className="space-y-3">
            {players.length > 0 ? (
              players.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg ${
                    player.isCurrentTurn ? 'bg-primary-900/30 border border-primary-500/30' : 'bg-dark-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {session.gameMode === 'TURN_BASED' && (
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    )}
                    <span className="font-medium text-white">{player.character.name}</span>
                    {player.isCurrentTurn && (
                      <span className="text-xs text-primary-400">(Tura)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Poziom {player.character.level} • {player.character.health}/{player.character.maxHealth} HP
                  </div>
                  <div className="text-xs text-gray-500">
                    Gracz: {player.username}
                  </div>
                </div>
              ))
            ) : (
              session.participants.map((p, index) => (
                <div key={p.id} className="p-3 rounded-lg bg-dark-800">
                  <div className="flex items-center space-x-2">
                    {session.gameMode === 'TURN_BASED' && (
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    )}
                    <span className="font-medium text-white">{p.character.name}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Poziom {p.character.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    Gracz: {p.user.username}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">NPC</h3>
            {session.npcs.length > 0 ? (
              <div className="space-y-2">
                {session.npcs.map((npc) => (
                  <div key={npc.id} className="p-2 rounded bg-dark-800 text-sm">
                    <span className="text-green-400">{npc.name}</span>
                    <span className="text-gray-500 ml-2">({npc.role})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Brak NPC</p>
            )}
          </div>
        </div>

        {/* Main game area */}
        <div className="col-span-3 flex flex-col">
          {!isJoined ? (
            <div className="card flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Dołącz do sesji
                </h3>
                <p className="text-gray-400 mb-6">
                  Wybierz postać, którą chcesz grać:
                </p>
                
                {userCharacters.length > 0 ? (
                  <>
                    <select
                      value={selectedCharacter}
                      onChange={(e) => setSelectedCharacter(e.target.value)}
                      className="input mb-4"
                    >
                      <option value="">Wybierz postać...</option>
                      {userCharacters.map((char) => (
                        <option key={char.id} value={char.id}>
                          {char.name} (Poziom {char.level})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleJoin}
                      disabled={!selectedCharacter}
                      className="btn-primary w-full"
                    >
                      Dołącz do gry
                    </button>
                  </>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-4">Nie masz żadnych postaci</p>
                    <button
                      onClick={() => navigate('/characters/create')}
                      className="btn-primary"
                    >
                      Utwórz postać
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="card flex-1 overflow-hidden flex flex-col mb-4">
                <div className="flex-1 overflow-y-auto space-y-2 p-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <p>Brak wiadomości</p>
                      <p className="text-sm mt-2">
                        Rozpocznij przygodę wykonując pierwszą akcję!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <GameMessageComponent key={msg.id} message={msg} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Action input */}
              <div className="card mb-2">
                <form onSubmit={handleSendAction} className="flex space-x-2">
                  <input
                    type="text"
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                    className="input flex-1"
                    placeholder="Wykonaj akcję (np. 'Sprawdza skrzynię', 'Atakuje goblina')..."
                    disabled={session.status !== 'IN_PROGRESS'}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={session.status !== 'IN_PROGRESS' || !actionInput.trim()}
                  >
                    Wykonaj
                  </button>
                </form>
              </div>

              {/* Chat input */}
              <div className="card">
                <form onSubmit={handleSendChat} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="input flex-1"
                    placeholder="Napisz wiadomość do innych graczy..."
                  />
                  <button
                    type="submit"
                    className="btn-secondary"
                    disabled={!chatInput.trim()}
                  >
                    Wyślij
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
