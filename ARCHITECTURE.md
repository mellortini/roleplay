# 🏗️ Architektura Deploymentu

## Diagram Komunikacji

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────────┐              ┌──────────────────────┐
│   FRONTEND (React)   │              │   BACKEND (Node.js)  │
│ roleplayclient.up... │              │ roleplayserver.up... │
│                      │              │                      │
│ - React + Vite       │              │ - Express            │
│ - Socket.io Client   │              │ - Socket.io Server   │
│ - Axios (HTTP)       │              │ - Prisma ORM         │
└──────────────────────┘              └──────────────────────┘
        ↓                                           ↓
        │                                           │
        │ HTTPS (REST API)                          │
        │ /api/auth                                 │
        │ /api/characters                           │
        │ /api/sessions                             │
        │                                           │
        └──────────────────────┬────────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │   PostgreSQL (DB)    │
                    │ Railway Database     │
                    │                      │
                    │ - Users              │
                    │ - Characters         │
                    │ - GameSessions       │
                    │ - GameMessages       │
                    └──────────────────────┘
        
        ┌──────────────────────┐
        │   WebSocket (WSS)    │
        │ wss://roleplayserver │
        │                      │
        │ - game:join          │
        │ - game:action        │
        │ - game:chat          │
        │ - game:message       │
        └──────────────────────┘
```

---

## Przepływ Danych

### 1. Rejestracja / Login
```
Frontend (Login.tsx)
    ↓
POST /api/auth/login
    ↓
Backend (authController.ts)
    ↓
Prisma (User model)
    ↓
PostgreSQL
    ↓
JWT Token
    ↓
Frontend (localStorage)
```

### 2. Połączenie WebSocket
```
Frontend (GameRoom.tsx)
    ↓
useSocket.connect(token)
    ↓
io(wss://roleplayserver, { auth: { token } })
    ↓
Backend (gameSocket.ts)
    ↓
JWT Verification
    ↓
Socket Connected ✅
```

### 3. Wysłanie Akcji
```
Frontend (GameRoom.tsx)
    ↓
sendAction(sessionId, action)
    ↓
socket.emit('game:action', {...})
    ↓
Backend (gameSocket.ts)
    ↓
Prisma (GameMessage)
    ↓
PostgreSQL
    ↓
Broadcast to all players
    ↓
Frontend (useSocket)
    ↓
Update UI
```

---

## Zmienne Środowiskowe

### Frontend (VITE_*)
```
VITE_API_URL = https://roleplayserver.up.railway.app
    ↓
axios.create({ baseURL: '/api' })
    ↓
Proxy w Vite (dev) lub bezpośredni URL (prod)

VITE_SOCKET_URL = https://roleplayserver.up.railway.app
    ↓
io(SOCKET_URL)
    ↓
Konwersja https:// → wss://
```

### Backend (NODE_*)
```
DATABASE_URL = postgresql://...
    ↓
Prisma Client
    ↓
PostgreSQL

JWT_SECRET = <losowy-32-znaki>
    ↓
JWT Verification
    ↓
Socket Auth

CLIENT_URL = https://roleplayclient.up.railway.app
    ↓
CORS Configuration
    ↓
Allow requests from frontend

NODE_ENV = production
    ↓
Express optimizations
    ↓
No debug logs
```

---

## Bezpieczeństwo

### 1. JWT Token
```
Frontend
    ↓
localStorage.setItem('token', token)
    ↓
axios interceptor
    ↓
Authorization: Bearer <token>
    ↓
Backend
    ↓
JWT Verification
    ↓
socket.data.userId = decoded.userId
```

### 2. CORS
```
Frontend (https://roleplayclient.up.railway.app)
    ↓
Request to Backend
    ↓
CORS Middleware
    ↓
Check origin === CLIENT_URL
    ↓
Allow / Deny
```

### 3. WebSocket Auth
```
Frontend
    ↓
io(url, { auth: { token } })
    ↓
Backend
    ↓
Socket Middleware
    ↓
JWT Verification
    ↓
socket.data.userId = decoded.userId
```

---

## Deployment Flow

### 1. Push do GitHub
```
git push
    ↓
GitHub Webhook
    ↓
Railway Notification
```

### 2. Build
```
Railway
    ↓
npm install
    ↓
postinstall: prisma generate && prisma migrate deploy
    ↓
npm run build
    ↓
tsc (TypeScript compilation)
```

### 3. Deploy
```
Railway
    ↓
npm run start
    ↓
node dist/index.js
    ↓
Server listening on PORT
```

### 4. Health Check
```
Railway
    ↓
GET /api/health
    ↓
200 OK
    ↓
Deployment Success ✅
```

---

## Problemy i Rozwiązania

### Problem: WebSocket nie łączy się
```
Przyczyna: https:// zamiast wss://
Rozwiązanie: Konwersja URL w useSocket.ts
```

### Problem: CORS error
```
Przyczyna: CLIENT_URL nie ustawiony
Rozwiązanie: Ustaw CLIENT_URL na Railway
```

### Problem: 401 Unauthorized
```
Przyczyna: JWT_SECRET inny na serwerze
Rozwiązanie: Ustaw JWT_SECRET na Railway
```

### Problem: Database connection failed
```
Przyczyna: DATABASE_URL nie ustawiony
Rozwiązanie: Dodaj PostgreSQL do Railway
```

---

## Monitoring

### Logi
```
Railway → Deployments → Logs
    ↓
Szukaj: error, warning, exception
```

### Metryki
```
Railway → Metrics
    ↓
CPU, Memory, Network
```

### Health Check
```
GET /api/health
    ↓
{"status":"ok","timestamp":"..."}
```

---

## Skalowanie

### Jeśli aplikacja rośnie:

1. **Zwiększ zasoby:**
   - Railway → Settings → Resources
   - Zwiększ CPU/Memory

2. **Dodaj repliki:**
   - railway.json → numReplicas: 2+

3. **Optymalizuj bazę:**
   - Dodaj indeksy w Prisma
   - Zwiększ zasoby PostgreSQL

4. **Cache:**
   - Dodaj Redis
   - Cache session state

---

## Checklist Produkcji

- [ ] JWT_SECRET ustawiony
- [ ] NODE_ENV=production
- [ ] CLIENT_URL ustawiony
- [ ] DATABASE_URL ustawiony
- [ ] CORS skonfigurowany
- [ ] WebSocket SSL/TLS (wss://)
- [ ] Migracje uruchamiane
- [ ] Logi monitorowane
- [ ] Backupy bazy danych
- [ ] Error tracking (opcjonalnie)

---

**Architektura gotowa do produkcji! 🚀**
