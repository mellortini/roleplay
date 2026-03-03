# ⚡ Szybka Naprawa - Checklist

## 🔴 KRYTYCZNE - Zrób to TERAZ

### 1. Zmienne na Railway - SERVER
```
DATABASE_URL = <Railway doda automatycznie>
JWT_SECRET = <wygeneruj: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
CLIENT_URL = https://roleplayclient.up.railway.app
NODE_ENV = production
```

### 2. Zmienne na Railway - CLIENT
```
VITE_API_URL = https://roleplayserver.up.railway.app
VITE_SOCKET_URL = https://roleplayserver.up.railway.app
```

### 3. Kod - Już naprawiony ✅
- ✅ `client/src/hooks/useSocket.ts` - WebSocket URL konwersja
- ✅ `server/package.json` - postinstall script

---

## 🟡 WAŻNE - Sprawdź to

### 1. Build Commands
**SERVER:**
- Build: `npm run build`
- Start: `npm run start`
- Root: `server`

**CLIENT:**
- Build: `npm run build`
- Start: `npm run start`
- Root: `client`

### 2. PostgreSQL
- [ ] Dodaj PostgreSQL do SERVER projektu
- [ ] Sprawdź czy `DATABASE_URL` jest w Variables

### 3. Logi
- [ ] Sprawdź Railway → Deployments → Logs
- [ ] Szukaj błędów

---

## 🟢 TESTOWANIE

### 1. Backend
```
GET https://roleplayserver.up.railway.app/api/health
```
Powinno zwrócić: `{"status":"ok"}`

### 2. Frontend
```
https://roleplayclient.up.railway.app
```
Powinno załadować stronę

### 3. WebSocket
- Otwórz DevTools (F12)
- Network → WS
- Zaloguj się
- Powinieneś zobaczyć `wss://roleplayserver.up.railway.app`

### 4. Login
- Spróbuj się zalogować
- Powinno działać bez błędów

---

## 📝 Jeśli Dalej Nie Działa

1. **Sprawdź logi:**
   ```
   Railway → Deployments → Logs
   ```

2. **Sprawdź zmienne:**
   ```
   Railway → Variables
   ```

3. **Sprawdź DevTools:**
   ```
   F12 → Console → Network
   ```

4. **Sprawdź baza danych:**
   ```
   Railway → PostgreSQL → Connect
   ```

5. **Sprawdź build:**
   ```
   Railway → Deployments → Build Logs
   ```

---

## 🎯 Podsumowanie Zmian

### Zmienione Pliki:
1. ✅ `client/src/hooks/useSocket.ts` - WebSocket URL fix
2. ✅ `server/package.json` - postinstall script
3. ✅ `railway.json` - konfiguracja Railway (nowy)

### Nowe Pliki:
1. ✅ `DEPLOYMENT_ANALYSIS.md` - pełna analiza
2. ✅ `RAILWAY_SETUP.md` - instrukcja konfiguracji
3. ✅ `QUICK_FIX.md` - ten plik

---

## 🚀 Następne Kroki

1. Ustaw zmienne na Railway
2. Zrób redeploy
3. Testuj
4. Jeśli nie działa - sprawdź logi

**Powodzenia! 🎉**
