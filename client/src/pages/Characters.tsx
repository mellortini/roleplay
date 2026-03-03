import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { charactersApi } from '../services/characters';
import { Character } from '../types';
import { CharacterCard } from '../components/CharacterCard';

export const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await charactersApi.getAll();
      setCharacters(data);
    } catch {
      setError('Nie udało się załadować postaci');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (character: Character) => {
    if (!confirm(`Czy na pewno chcesz usunąć postać "${character.name}"?`)) {
      return;
    }

    try {
      await charactersApi.delete(character.id);
      setCharacters((prev) => prev.filter((c) => c.id !== character.id));
    } catch {
      setError('Nie udało się usunąć postaci');
    }
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
        <h1 className="text-3xl font-bold text-white">Moje Postacie</h1>
        <Link to="/characters/create" className="btn-primary">
          Utwórz postać
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {characters.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg mb-4">Nie masz jeszcze żadnych postaci</p>
          <p className="text-gray-500 mb-6">
            Utwórz swoją pierwszą postać, aby zacząć przygodę!
          </p>
          <div className="space-x-4">
            <Link to="/characters/create" className="btn-primary">
              Utwórz ręcznie
            </Link>
            <Link to="/characters/generate" className="btn-secondary">
              Generuj z AI
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
