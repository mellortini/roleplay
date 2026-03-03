# Roleplay - Tekstowa Gra RPG

Webowa aplikacja do tekstowego roleplay z AI. Twórz postacie, dołączaj do sesji i wyrusz na przygody z innymi graczami!

## 🚀 Funkcje

- **Tworzenie Postaci**: Ręcznie lub generowane przez AI
- **Multiplayer**: Graj z wieloma graczami w tym samym czasie
- **WebSocket**: Komunikacja real-time
- **AI Narrator**: Odpowiedzi NPC i narracje generowane przez AI (Anthropic lub Hugging Face)
- **Tryby Gry**: Turowy lub Real-time
- **PostgreSQL**: Trwałe przechowywanie danych

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + Socket.io + Prisma ORM
- **Baza danych**: PostgreSQL
- **AI**: Anthropic Claude lub Hugging Face API

## 📋 Wymagania

- Node.js 18+
- PostgreSQL 14+
- (Opcjonalnie) API Key od Anthropic lub Hugging Face

## 🚀 Instalacja

### 1. Klonowanie repozytorium

```bash
git clone <repo-url>
cd roleplay
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja bazy danych

Masz kilka opcji:

#### Opcja A: Docker (Najprostsza - bez instalacji PostgreSQL)
```bash
docker run --name postgres-roleplay -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=roleplay_db -p 5432:5432 -d postgres:15
```

#### Opcja B: Railway (Cloud - darmowa)
1. Wejdź na [railway.app](https://railway.app)
2. Utwórz nowy projekt → New Database → PostgreSQL
3. Skopiuj "Database URL" do pliku `.env`

#### Opcja C: Lokalna instalacja PostgreSQL
Utwórz bazę danych:
```sql
CREATE DATABASE roleplay_db;
```

### 4. Konfiguracja zmiennych środowiskowych

Skopiuj plik `.env.example` do `.env` w folderze `server`:

```bash
cd server
cp .env.example .env
```

Edytuj `.env` i ustaw:
- `DATABASE_URL` - connection string do PostgreSQL
- `JWT_SECRET` - sekretny klucz dla JWT (zmień w produkcji!)
- (Opcjonalnie) `ANTHROPIC_API_KEY` lub `HUGGINGFACE_API_KEY`

### 5. Migracje bazy danych

```bash
cd server
npx prisma migrate dev
```

### 6. Uruchomienie aplikacji

W głównym folderze projektu:

```bash
npm run dev
```

To uruchomi:
- Backend na `http://localhost:3001`
- Frontend na `http://localhost:5173`

## 📝 Struktura Projektu

```
roleplay/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Komponenty UI
│   │   ├── pages/          # Strony aplikacji
│   │   ├── services/       # API calls
│   │   ├── stores/         # Zustand stores
│   │   └── hooks/          # Custom hooks
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Kontrolery
│   │   ├── routes/         # Endpointy API
│   │   ├── services/       # Logika biznesowa
│   │   ├── sockets/        # WebSocket handlers
│   │   └── middleware/     # Middleware
│   ├── prisma/
│   │   └── schema.prisma   # Schema bazy danych
│   └── ...
└── package.json           # Root package.json
```

## 🔧 Konfiguracja AI

Aplikacja obsługuje dwa dostawców AI:

### Anthropic (Claude)
1. Uzyskaj API key na [anthropic.com](https://www.anthropic.com)
2. Dodaj do `.env`: `ANTHROPIC_API_KEY=twój-klucz`

### Hugging Face
1. Uzyskaj API key na [huggingface.co](https://huggingface.co)
2. Dodaj do `.env`: `HUGGINGFACE_API_KEY=twój-klucz`
3. (Opcjonalnie) `HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf`

> **Uwaga**: Jeśli nie podasz klucza API, aplikacja użyje fallback responses (predefiniowane odpowiedzi).

## 🎮 Jak Grać

1. **Zarejestruj się** na stronie głównej
2. **Utwórz postać** - ręcznie lub wygeneruj przez AI
3. **Wejdź do Lobby** i dołącz do istniejącej sesji lub utwórz własną
4. **Dołącz do gry** wybierając swoją postać
5. **Graj** - wykonuj akcje, rozmawiaj z innymi graczami, reaguj na narrację AI

## 🧪 Development

### Polecenia npm

```bash
# Uruchomienie obu serwerów jednocześnie
npm run dev

# Tylko backend
npm run dev:server

# Tylko frontend
npm run dev:client

# Migracje bazy
npm run db:migrate

# Prisma Studio (GUI do bazy)
npm run db:studio
```

### API Endpoints

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/auth/register` | POST | Rejestracja użytkownika |
| `/api/auth/login` | POST | Logowanie |
| `/api/auth/me` | GET | Dane zalogowanego użytkownika |
| `/api/characters` | GET/POST | Lista postaci / Utwórz postać |
| `/api/characters/:id` | GET/PUT/DELETE | Szczegóły/Edycja/Usunięcie postaci |
| `/api/characters/generate` | POST | Generuj postać przez AI |
| `/api/sessions` | GET/POST | Lista sesji / Utwórz sesję |
| `/api/sessions/:id` | GET | Szczegóły sesji |
| `/api/sessions/:id/join` | POST | Dołącz do sesji |
| `/api/sessions/:id/leave` | POST | Opuść sesję |
| `/api/sessions/:id/start` | POST | Rozpocznij grę |
| `/api/sessions/:id/end` | POST | Zakończ grę |

## 📝 Licencja

MIT
