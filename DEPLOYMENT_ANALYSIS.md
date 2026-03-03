# 🔍 Analiza Problemów Deploymentu - Roleplay App

## 🚨 Zidentyfikowane Problemy

### 1. **KRYTYCZNE: Brak zmiennych środowiskowych na Railway**
**Problem:** Frontend nie ma dostępu do zmiennych `VITE_API_URL` i `VITE_SOCKET_URL`

**Przyczyna:**
- Zmienne Vite muszą być dostępne w **build time**, a nie runtime
- Railway nie ma pliku `.env.local` dla frontendu
- Frontend buduje się z domyślnymi wartościami `http://localhost:3001`

**Rozwiązanie:**
```bash
# W Railway - ustaw zmienne dla CLIENT (Frontend):
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

---

### 2. **KRYTYCZNE: WebSocket nie działa na HTTPS**
**Problem:** `VITE_SOCKET_URL` używa `https://` ale Socket.io wymaga `wss://`

**Przyczyna:**
- Socket.io na HTTPS musi używać WebSocket Secure (`wss://`)
- Zwykły `https://` nie będzie działać dla WebSocket

**Rozwiązanie:**
W `client/src/hooks/useSocket.ts` zmień:
```typescript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
```

Na:
```typescript
const SOCKET_URL = (() => {
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  // Konwertuj https:// na wss:// dla WebSocket
  if (url.startsWith('https://')) {
    return url.replace('https://', 'wss://');
  }
  if (url.startsWith('http://')) {
    return url.replace('http://', 'ws://');
  }
  return url;
})();
```

---

### 3. **WAŻNE: CORS nie jest skonfigurowany dla produkcji**
**Problem:** Backend CORS pozwala tylko na `CLIENT_URL`, ale może być problem z portami

**Przyczyna:**
- W `server/src/index.ts` CORS jest ustawiony na `process.env.CLIENT_URL`
- Jeśli `CLIENT_URL` nie jest ustawiony, domyślnie `http://localhost:5173`

**Rozwiązanie:**
Upewnij się, że na Railway masz ustawione:
```
SERVER (Backend):
CLIENT_URL=https://roleplayclient.up.railway.app

CLIENT (Frontend):
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

---

### 4. **WAŻNE: Brak PORT w zmiennych serwera**
**Problem:** Backend może nie słuchać na porcie, który Railway przydzielił

**Przyczyna:**
- Railway przydzieluje dynamiczny PORT w zmiennej `PORT`
- Backend czyta `process.env.PORT || 3001`, co powinno działać
- Ale upewnij się, że Railway ma to ustawione

**Rozwiązanie:**
Dodaj do Railway (SERVER):
```
PORT=3000
NODE_ENV=production
```

---

### 5. **WAŻNE: Brak JWT_SECRET na Railway**
**Problem:** Jeśli `JWT_SECRET` nie jest ustawiony, używa się domyślny `'your-secret-key'`

**Przyczyna:**
- W `server/src/sockets/gameSocket.ts` i `server/src/middleware/auth.ts` używa się `process.env.JWT_SECRET || 'your-secret-key'`
- To jest NIEBEZPIECZNE w produkcji

**Rozwiązanie:**
Ustaw na Railway (SERVER):
```
JWT_SECRET=twoj-losowy-ciag-znakow-min-32-znaki
```

---

### 6. **WAŻNE: Brak NODE_ENV=production**
**Problem:** Aplikacja może działać w trybie development

**Przyczyna:**
- Brak ustawienia `NODE_ENV=production` na Railway
- Może powodować problemy z wydajnością i bezpieczeństwem

**Rozwiązanie:**
Ustaw na Railway (SERVER):
```
NODE_ENV=production
```

---

### 7. **POTENCJALNY: Brak build scriptu dla frontendu**
**Problem:** Frontend może nie być zbudowany przed deploymentem

**Przyczyna:**
- W `client/package.json` jest `"build": "tsc && vite build"`
- Railway musi wiedzieć, jak zbudować frontend

**Rozwiązanie:**
Sprawdź `railway.json` lub `Procfile` - powinien zawierać:
```bash
# Dla frontendu
npm run build

# Dla backendu
npm run build
```

---

### 8. **POTENCJALNY: Brak migracji bazy danych**
**Problem:** Baza danych może nie mieć tabel

**Przyczyna:**
- Prisma migracje nie są uruchamiane automatycznie na Railway
- Tabele mogą nie istnieć

**Rozwiązanie:**
Dodaj do `server/package.json`:
```json
"postinstall": "prisma generate && prisma migrate deploy"
```

---

## ✅ Checklist Konfiguracji Railway

### SERVER (Backend)
- [ ] `DATABASE_URL` - Railway doda automatycznie
- [ ] `JWT_SECRET` - Ustaw na losowy ciąg min 32 znaki
- [ ] `CLIENT_URL` - `https://roleplayclient.up.railway.app`
- [ ] `PORT` - Ustaw na `3000` lub zostaw puste (Railway przydzieli)
- [ ] `NODE_ENV` - `production`
- [ ] `ANTHROPIC_API_KEY` - (opcjonalnie)
- [ ] `HUGGINGFACE_API_KEY` - (opcjonalnie)

### CLIENT (Frontend)
- [ ] `VITE_API_URL` - `https://roleplayserver.up.railway.app`
- [ ] `VITE_SOCKET_URL` - `https://roleplayserver.up.railway.app`

---

## 🔧 Kroki do Naprawy

### Krok 1: Zaktualizuj `useSocket.ts`
Zmień konwersję URL dla WebSocket (patrz problem #2)

### Krok 2: Ustaw zmienne na Railway
```
SERVER:
DATABASE_URL=<Railway doda>
JWT_SECRET=<losowy-ciag-32-znaki>
CLIENT_URL=https://roleplayclient.up.railway.app
NODE_ENV=production
PORT=3000

CLIENT:
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

### Krok 3: Dodaj postinstall script
W `server/package.json` dodaj:
```json
"postinstall": "prisma generate && prisma migrate deploy"
```

### Krok 4: Zbuduj i deployuj
```bash
npm run build
git push
```

---

## 🧪 Testowanie

1. **Sprawdź backend:**
   ```
   https://roleplayserver.up.railway.app/api/health
   ```
   Powinno zwrócić: `{"status":"ok","timestamp":"..."}`

2. **Sprawdź frontend:**
   ```
   https://roleplayclient.up.railway.app
   ```
   Powinno załadować stronę

3. **Sprawdź WebSocket:**
   Otwórz DevTools → Network → WS
   Powinno być połączenie do `wss://roleplayserver.up.railway.app`

4. **Sprawdź login:**
   Spróbuj się zalogować - powinno działać

---

## 📝 Notatki

- **HTTPS vs HTTP**: Railway automatycznie konwertuje HTTP na HTTPS
- **WebSocket**: Musi być `wss://` na HTTPS, `ws://` na HTTP
- **CORS**: Musi być ustawiony na dokładny URL frontendu
- **JWT**: Musi być ustawiony na losowy ciąg w produkcji
- **Migracje**: Muszą być uruchamiane automatycznie

---

## 🆘 Jeśli Dalej Nie Działa

1. Sprawdź logi na Railway (Deployments → Logs)
2. Sprawdź DevTools w przeglądarce (Console, Network)
3. Sprawdź czy zmienne są ustawione: Railway → Variables
4. Sprawdź czy baza danych jest dostępna: Railway → PostgreSQL → Connect
5. Sprawdź czy frontend się zbudował: Railway → Deployments
