import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameSessionsApi } from '../services/gameSessions';
import { GameMode } from '../types';

export const CreateSession = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameMode: 'TURN_BASED' as GameMode,
    maxPlayers: 4,
    storyContext: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = await gameSessionsApi.create(formData);
      navigate(`/sessions/${session.id}`);
    } catch {
      setError('Nie udało się utworzyć sesji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' 
        ? parseInt(value) || 2
        : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Utwórz Sesję Gry</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nazwa sesji *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
            maxLength={100}
            placeholder="np. Wyprawa do Zapomnianych Krain"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Opis
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input h-24 resize-none"
            maxLength={500}
            placeholder="Krótki opis fabuły, klimatu, oczekiwań od graczy..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tryb gry
            </label>
            <select
              name="gameMode"
              value={formData.gameMode}
              onChange={handleChange}
              className="input"
            >
              <option value="TURN_BASED">Turowy</option>
              <option value="REAL_TIME">Real-time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Maks. graczy
            </label>
            <input
              type="number"
              name="maxPlayers"
              value={formData.maxPlayers}
              onChange={handleChange}
              className="input"
              min={2}
              max={10}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Kontekst fabularny / Scenariusz
          </label>
          <textarea
            name="storyContext"
            value={formData.storyContext}
            onChange={handleChange}
            className="input h-40 resize-none"
            maxLength={2000}
            placeholder="Opis świata, początkowa scena, postacie NPC, cele fabularne... To pomoże AI w generowaniu narracji."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.storyContext.length}/2000
          </p>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/lobby')}
            className="btn-secondary flex-1"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Tworzenie...' : 'Utwórz sesję'}
          </button>
        </div>
      </form>
    </div>
  );
};
