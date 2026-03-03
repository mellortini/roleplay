import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { charactersApi } from '../services/characters';

export const CreateCharacter = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    backstory: '',
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 10,
    agility: 10,
    intelligence: 10,
    charisma: 10,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Plik jest za duży. Maksymalny rozmiar to 5MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const character = await charactersApi.create(formData);
      
      // Upload avatar if selected
      if (avatarFile) {
        await charactersApi.uploadAvatar(character.id, avatarFile);
      }
      
      navigate('/characters');
    } catch (err) {
      setError('Nie udało się utworzyć postaci');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('health') || name.includes('mana') || 
               ['strength', 'agility', 'intelligence', 'charisma'].includes(name)
        ? parseInt(value) || 0
        : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Utwórz Postać</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Awatar postaci
          </label>
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-dark-800 border-2 border-dashed border-dark-600 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🎭</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">Maksymalny rozmiar: 5MB</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Imię *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
            maxLength={50}
            placeholder="Imię twojej postaci"
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
            placeholder="Opis wyglądu, cech charakterystycznych..."
          />
          <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Historia
          </label>
          <textarea
            name="backstory"
            value={formData.backstory}
            onChange={handleChange}
            className="input h-32 resize-none"
            maxLength={1000}
            placeholder="Przeszłość twojej postaci, motywacje, doświadczenia..."
          />
          <p className="text-xs text-gray-500 mt-1">{formData.backstory.length}/1000</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              HP
            </label>
            <input
              type="number"
              name="health"
              value={formData.health}
              onChange={handleChange}
              className="input"
              min={10}
              max={200}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mana
            </label>
            <input
              type="number"
              name="mana"
              value={formData.mana}
              onChange={handleChange}
              className="input"
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Siła
            </label>
            <input
              type="number"
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              className="input"
              min={1}
              max={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Zręczność
            </label>
            <input
              type="number"
              name="agility"
              value={formData.agility}
              onChange={handleChange}
              className="input"
              min={1}
              max={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Inteligencja
            </label>
            <input
              type="number"
              name="intelligence"
              value={formData.intelligence}
              onChange={handleChange}
              className="input"
              min={1}
              max={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Charyzma
            </label>
            <input
              type="number"
              name="charisma"
              value={formData.charisma}
              onChange={handleChange}
              className="input"
              min={1}
              max={20}
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
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
            disabled={isLoading}
          >
            {isLoading ? 'Tworzenie...' : 'Utwórz postać'}
          </button>
        </div>
      </form>
    </div>
  );
};
