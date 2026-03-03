import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="text-center">
      <div className="max-w-3xl mx-auto mt-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Witaj w <span className="text-primary-400">Roleplay</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Twórz postacie, dołączaj do sesji i wyrusz na tekstowe przygody z innymi graczami.
          
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-lg font-semibold text-white mb-2">Twórz Postacie</h3>
            <p className="text-gray-400 text-sm">
              Twórz unikalne postacie ręcznie lub generuj je z pomocą AI
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Graj</h3>
            <p className="text-gray-400 text-sm">
              Dołączaj do sesji i przeżywaj epickie przygody w czasie rzeczywistym
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Narrator</h3>
            <p className="text-gray-400 text-sm">
              Odpowiedzi NPC i narracje generowane przez sztuczną inteligencję
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <Link to="/lobby" className="btn-primary text-lg px-8 py-4">
            Przejdź do Lobby
          </Link>
        ) : (
          <div className="space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Zacznij Grać
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Masz już konto?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
