import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onSelect?: (character: Character) => void;
  onEdit?: (character: Character) => void;
  onDelete?: (character: Character) => void;
  isSelected?: boolean;
}

export const CharacterCard = ({ 
  character, 
  onSelect, 
  onEdit, 
  onDelete,
  isSelected 
}: CharacterCardProps) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  return (
    <div 
      className={`card transition-all ${
        isSelected 
          ? 'border-primary-500 ring-2 ring-primary-500/20' 
          : 'hover:border-dark-600'
      }`}
    >
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-dark-800 flex-shrink-0 overflow-hidden">
          {character.avatarUrl ? (
            <img
              src={`${apiUrl}${character.avatarUrl}`}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🎭
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{character.name}</h3>
          <p className="text-gray-400 text-sm">Poziom {character.level}</p>
        </div>
        
        {onSelect && (
          <button
            onClick={() => onSelect(character)}
            className={`btn-primary text-sm ${isSelected ? 'opacity-50' : ''}`}
            disabled={isSelected}
          >
            {isSelected ? 'Wybrano' : 'Wybierz'}
          </button>
        )}
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{character.description}</p>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="bg-dark-800 rounded px-3 py-2">
          <span className="text-gray-400">HP:</span>{' '}
          <span className="text-red-400">{character.health}/{character.maxHealth}</span>
        </div>
        <div className="bg-dark-800 rounded px-3 py-2">
          <span className="text-gray-400">Mana:</span>{' '}
          <span className="text-blue-400">{character.mana}/{character.maxMana}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs mb-4">
        <div className="bg-dark-800 rounded px-2 py-1 text-center">
          <span className="text-gray-400 block">Siła</span>
          <span className="text-yellow-400 font-medium">{character.strength}</span>
        </div>
        <div className="bg-dark-800 rounded px-2 py-1 text-center">
          <span className="text-gray-400 block">Zręczność</span>
          <span className="text-green-400 font-medium">{character.agility}</span>
        </div>
        <div className="bg-dark-800 rounded px-2 py-1 text-center">
          <span className="text-gray-400 block">Int</span>
          <span className="text-purple-400 font-medium">{character.intelligence}</span>
        </div>
        <div className="bg-dark-800 rounded px-2 py-1 text-center">
          <span className="text-gray-400 block">Charyzma</span>
          <span className="text-pink-400 font-medium">{character.charisma}</span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(character)}
              className="btn-secondary text-sm flex-1"
            >
              Edytuj
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(character)}
              className="btn-danger text-sm flex-1"
            >
              Usuń
            </button>
          )}
        </div>
      )}
    </div>
  );
};
