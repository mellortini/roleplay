# 🎨 Wizualny Przewodnik Deploymentu

## 1️⃣ Przygotowanie

```
┌─────────────────────────────────────────┐
│  Wygeneruj JWT_SECRET                   │
│  node generate-jwt-secret.js            │
│                                         │
│  Skopiuj wynik (32-znakowy ciąg)       │
└─────────────────────────────────────────┘
```

---

## 2️⃣ Deployment SERVER (Backend)

```
┌─────────────────────────────────────────┐
│  railway.app                            │
│  ↓                                      │
│  New Project                            │
│  ↓                                      │
│  Deploy from GitHub                     │
│  ↓                                      │
│  Wybierz repozytorium                   │
│  ↓                                      │
│  Root Directory: server                 │
│  ↓                                      │
│  + Add Database → PostgreSQL            │
│  ↓                                      │
│  Variables:                             │
│  ├─ DATABASE_URL (Railway doda)         │
│  ├─ JWT_SECRET (wklej)                  │
│  ├─ CLIENT_URL (frontend URL)           │
│  └─ NODE_ENV = production               │
│  ↓                                      │
│  Deploy                                 │
│  ↓                                      │
│  ✅ Backend gotowy                      │
└─────────────────────────────────────────┘
```

---

## 3️⃣ Deployment CLIENT (Frontend)

```
┌─────────────────────────────────────────┐
│  railway.app                            │
│  ↓                                      │
│  New Project                            │
│  ↓                                      │
│  Deploy from GitHub                     │
│  ↓                                      │
│  Wybierz repozytorium                   │
│  ↓                                      │
│  Root Directory: client                 │
│  ↓                                      │
│  Variables:                             │
│  ├─ VITE_API_URL (backend URL)          │
│  └─ VITE_SOCKET_URL (backend URL)       │
│  ↓                                      │
│  Deploy                                 │
│  ↓                                      │
│  ✅ Frontend gotowy                     │
└─────────────────────────────────────────┘
```

---

## 4️⃣ Testowanie

### Test 1: Backend Health Check
```
GET https://roleplayserver.up.railway.app/api/health

Response:
{
  "status": "ok",
  "timestamp": "2024-03-03T..."
}

✅ Backend działa
```

### Test 2: Frontend Load
```
GET https://roleplayclient.up.railway.app

Response:
HTML strony logowania

✅ Frontend działa
```

### Test 3: WebSocket Connection
```
DevTools (F12)
  ↓
Network → WS
  ↓
Zaloguj się
  ↓
Powinieneś zobaczyć:
wss://roleplayserver.up.railway.app

✅ WebSocket działa
```

### Test 4: Login
```
Frontend
  ↓
Email: test@example.com
Password: password123
  ↓
Kliknij Login
  ↓
Powinieneś być zalogowany
  ↓
Token w localStorage

✅ Login działa
```

---

## 5️⃣ Troubleshooting Flow

```
Coś nie działa?
  ↓
┌─────────────────────────────────────────┐
│ Sprawdź logi                            │
│ Railway → Deployments → Logs            │
│                                         │
│ Szukaj: error, failed, exception        │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ Sprawdź zmienne                         │
│ Railway → Variables                     │
│                                         │
│ Czy wszystkie są ustawione?             │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ Sprawdź DevTools                        │
│ F12 → Console → Network                 │
│                                         │
│ Czy są błędy?                           │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ Sprawdź FAQ_DEPLOYMENT.md               │
│                                         │
│ Czy masz podobny problem?               │
└─────────────────────────────────────────┘
```

---

## 6️⃣ Architektura

```
┌──────────────────────────────────────────────────────────┐
│                      INTERNET                            │
└──────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│  FRONTEND        │              │  BACKEND         │
│  React + Vite    │              │  Node + Express  │
│  Port: 4173      │              │  Port: 3001      │
│                  │              │                  │
│  HTTPS           │              │  HTTPS           │
│  REST API        │              │  REST API        │
│  WebSocket       │              │  WebSocket       │
└──────────────────┘              └──────────────────┘
        ↓                                   ↓
        │                                   │
        │ HTTPS (REST)                      │
        │ /api/auth                         │
        │ /api/characters                   │
        │ /api/sessions                     │
        │                                   │
        └──────────────────┬────────────────┘
                           ↓
                ┌──────────────────────┐
                │  PostgreSQL          │
                │  Railway Database    │
                │                      │
                │  Users               │
                │  Characters          │
                │  GameSessions        │
                │  GameMessages        │
                └──────────────────────┘
        
        ┌──────────────────────┐
        │  WebSocket (WSS)     │
        │  Real-time Events    │
        │                      │
        │  game:join           │
        │  game:action         │
        │  game:chat           │
        │  game:message        │
        └──────────────────────┘
```

---

## 7️⃣ Zmienne Środowiskowe

### SERVER
```
┌─────────────────────────────────────────┐
│ DATABASE_URL                            │
│ ├─ Automatycznie od Railway             │
│ └─ PostgreSQL connection string         │
│                                         │
│ JWT_SECRET                              │
│ ├─ Wygeneruj: node generate-jwt-secret  │
│ └─ Min 32 znaki                         │
│                                         │
│ CLIENT_URL                              │
│ ├─ https://roleplayclient.up.railway   │
│ └─ Dla CORS                             │
│                                         │
│ NODE_ENV                                │
│ ├─ production                           │
│ └─ Dla optymalizacji                    │
└─────────────────────────────────────────┘
```

### CLIENT
```
┌─────────────────────────────────────────┐
│ VITE_API_URL                            │
│ ├─ https://roleplayserver.up.railway   │
│ └─ Dla REST API                         │
│                                         │
│ VITE_SOCKET_URL                         │
│ ├─ https://roleplayserver.up.railway   │
│ └─ Konwertuje się na wss://             │
└─────────────────────────────────────────┘
```

---

## 8️⃣ Przepływ Danych

### Login
```
Frontend
  ↓
POST /api/auth/login
  ↓
Backend
  ↓
Sprawdź email/hasło
  ↓
Wygeneruj JWT token
  ↓
Zwróć token
  ↓
Frontend
  ↓
Zapisz w localStorage
  ↓
Przekieruj do lobby
```

### WebSocket Connection
```
Frontend
  ↓
io(wss://..., { auth: { token } })
  ↓
Backend
  ↓
Sprawdź token
  ↓
Ustaw socket.data.userId
  ↓
Emit 'connect'
  ↓
Frontend
  ↓
setIsConnected(true)
```

### Wysłanie Akcji
```
Frontend
  ↓
socket.emit('game:action', {...})
  ↓
Backend
  ↓
Sprawdź uprawnienia
  ↓
Zapisz w bazie
  ↓
Broadcast do wszystkich
  ↓
Frontend (wszyscy gracze)
  ↓
Aktualizuj UI
```

---

## 9️⃣ Bezpieczeństwo

```
┌─────────────────────────────────────────┐
│ JWT Token                               │
│ ├─ Wygenerowany na login                │
│ ├─ Przechowywany w localStorage         │
│ ├─ Wysyłany w Authorization header      │
│ └─ Weryfikowany na backend              │
│                                         │
│ CORS                                    │
│ ├─ Sprawdza origin                      │
│ ├─ Pozwala tylko na CLIENT_URL          │
│ └─ Blokuje inne domeny                  │
│                                         │
│ WebSocket Auth                          │
│ ├─ Token w auth handshake               │
│ ├─ Weryfikowany na middleware           │
│ └─ Blokuje bez tokenu                   │
│                                         │
│ Hasła                                   │
│ ├─ Hashowane bcrypt                     │
│ ├─ Nigdy nie przechowywane w plain      │
│ └─ Nigdy nie wysyłane do frontendu      │
└─────────────────────────────────────────┘
```

---

## 🔟 Monitoring

```
┌─────────────────────────────────────────┐
│ Codziennie                              │
│ ├─ Sprawdź czy aplikacja jest dostępna  │
│ ├─ Sprawdź logi na Railway              │
│ └─ Sprawdź metryki (CPU, Memory)        │
│                                         │
│ Co Tydzień                              │
│ ├─ Sprawdź aktualizacje zależności      │
│ ├─ Sprawdź rozmiar bazy danych          │
│ └─ Sprawdź wydajność                    │
│                                         │
│ Co Miesiąc                              │
│ ├─ Sprawdź koszty                       │
│ ├─ Sprawdź backupy                      │
│ └─ Sprawdź bezpieczeństwo               │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist

```
Przygotowanie
  ☐ Wygeneruj JWT_SECRET
  ☐ Masz URL frontendu
  ☐ Masz URL backendu

SERVER
  ☐ Utwórz projekt
  ☐ Dodaj PostgreSQL
  ☐ Ustaw zmienne
  ☐ Deploy

CLIENT
  ☐ Utwórz projekt
  ☐ Ustaw zmienne
  ☐ Deploy

Testowanie
  ☐ Backend health check
  ☐ Frontend load
  ☐ WebSocket connection
  ☐ Login

Gotowe!
  ☐ Aplikacja działa
  ☐ Logi są czyste
  ☐ Metryki są OK
```

---

## 🎉 Gotowe!

Jeśli wszystkie kroki są wykonane, Twoja aplikacja powinna działać na Railway!

**Powodzenia! 🚀**
