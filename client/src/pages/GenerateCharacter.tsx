import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { charactersApi } from '../services/characters';

export const GenerateCharacter = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [generatedCharacter, setGeneratedCharacter] = useState<{
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
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const result = await charactersApi.generate(theme || undefined);
      setGeneratedCharacter(result);
    } catch {
      setError('Nie udało się wygenerować postaci. Spróbuj ponownie.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedCharacter) return;
    
    setIsSaving(true);
    try {
      await charactersApi.create({
        name: generatedCharacter.name,
        description: generatedCharacter.description,
        backstory: `${generatedCharacter.backstory}\n\nOsobowość: ${generatedCharacter.personality}`,
        ...generatedCharacter.stats,
      });
      navigate('/characters');
    } catch {
      setError('Nie udało się zapisać postaci');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Generuj Postać z AI</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!generatedCharacter ? (
        <div className="card">
          <p className="text-gray-300 mb-6">
            Podaj motyw przewodni lub świat, w którym ma powstać postać. 
            Zostaw puste, aby pozwolić AI na pełną kreatywność.
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Motyw / Świat (opcjonalne)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="input"
                placeholder="np. Postapokalipsa, Steampunk, Średniowiecze fantasy..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/characters')}
                className="btn-secondary flex-1"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generowanie...' : 'Generuj postać'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-primary-400">
              {generatedCharacter.name}
            </h2>
            <span className="bg-primary-900/50 text-primary-300 px-3 py-1 rounded-full text-sm">
              Wygenerowano przez AI
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Opis</h3>
            <p className="text-gray-200">{generatedCharacter.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Historia</h3>
            <p className="text-gray-200">{generatedCharacter.backstory}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Osobowość</h3>
            <p className="text-gray-200">{generatedCharacter.personality}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Statystyki podstawowe</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">HP:</span>
                  <span className="text-red-400">{generatedCharacter.stats.health}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mana:</span>
                  <span className="text-blue-400">{generatedCharacter.stats.mana}</span>
                </div>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Atrybuty</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Siła:</span>
                  <span className="text-yellow-400">{generatedCharacter.stats.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Zręczność:</span>
                  <span className="text-green-400">{generatedCharacter.stats.agility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Int:</span>
                  <span className="text-purple-400">{generatedCharacter.stats.intelligence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Charyzma:</span>
                  <span className="text-pink-400">{generatedCharacter.stats.charisma}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setGeneratedCharacter(null)}
              className="btn-secondary flex-1"
            >
              Wstecz
            </button>
            <button
              type="button"
              onClick={handleRegenerate}
              className="btn-secondary flex-1"
              disabled={isGenerating}
            >
              Generuj nową
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Zapisywanie...' : 'Zapisz postać'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
