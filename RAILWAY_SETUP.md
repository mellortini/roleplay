# 🚀 Instrukcja Konfiguracji Railway

## 1. Struktura Projektów na Railway

Powinieneś mieć **2 osobne projekty** na Railway:
- **roleplay-server** (Backend - Node.js)
- **roleplay-client** (Frontend - React/Vite)

---

## 2. Konfiguracja SERVER (Backend)

### 2.1 Utwórz projekt
1. Wejdź na [railway.app](https://railway.app)
2. Kliknij "New Project"
3. Wybierz "Deploy from GitHub"
4. Wybierz swoje repozytorium
5. Wybierz folder `server` jako root directory

### 2.2 Dodaj PostgreSQL
1. W projekcie kliknij "+ Add"
2. Wybierz "Add Database"
3. Wybierz "PostgreSQL"
4. Railway automatycznie doda `DATABASE_URL`

### 2.3 Ustaw zmienne środowiskowe
Wejdź w Variables i dodaj:

```
DATABASE_URL=<Railway doda automatycznie>
JWT_SECRET=<WYGENERUJ LOSOWY CIĄG MIN 32 ZNAKI>
CLIENT_URL=https://roleplayclient.up.railway.app
NODE_ENV=production
PORT=3000
```

**Jak wygenerować JWT_SECRET:**
```bash
# W terminalu:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Lub użyj online generatora: https://www.uuidgenerator.net/

### 2.4 Ustaw build i start commands
W "Settings" → "Build & Deploy":
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `server` (jeśli nie jest ustawiony)

### 2.5 Deploy
Kliknij "Deploy" - Railway automatycznie zbuduje i deployuje

---

## 3. Konfiguracja CLIENT (Frontend)

### 3.1 Utwórz projekt
1. Wejdź na [railway.app](https://railway.app)
2. Kliknij "New Project"
3. Wybierz "Deploy from GitHub"
4. Wybierz swoje repozytorium
5. Wybierz folder `client` jako root directory

### 3.2 Ustaw zmienne środowiskowe
Wejdź w Variables i dodaj:

```
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

**WAŻNE:** Zmienne Vite muszą być ustawione **PRZED** build!

### 3.3 Ustaw build i start commands
W "Settings" → "Build & Deploy":
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `client` (jeśli nie jest ustawiony)

### 3.4 Deploy
Kliknij "Deploy" - Railway automatycznie zbuduje i deployuje

---

## 4. Sprawdzenie Deploymentu

### 4.1 Sprawdź Backend
```
https://roleplayserver.up.railway.app/api/health
```
Powinno zwrócić:
```json
{"status":"ok","timestamp":"2024-03-03T..."}
```

### 4.2 Sprawdź Frontend
```
https://roleplayclient.up.railway.app
```
Powinno załadować stronę logowania

### 4.3 Sprawdź WebSocket
1. Otwórz frontend
2. Otwórz DevTools (F12)
3. Wejdź w Network → WS
4. Zaloguj się
5. Powinieneś zobaczyć połączenie do `wss://roleplayserver.up.railway.app`

### 4.4 Sprawdź Logi
W Railway → Deployments → Logs sprawdź czy są błędy

---

## 5. Zmienne Środowiskowe - Pełna Lista

### SERVER (Backend)
| Zmienna | Wartość | Opis |
|---------|---------|------|
| `DATABASE_URL` | Railway doda | PostgreSQL connection string |
| `JWT_SECRET` | losowy-32-znaki | Sekret do tokenów JWT |
| `CLIENT_URL` | https://roleplayclient.up.railway.app | URL frontendu |
| `NODE_ENV` | production | Tryb produkcji |
| `PORT` | 3000 | Port (opcjonalnie) |
| `ANTHROPIC_API_KEY` | sk-ant-... | (opcjonalnie) |
| `HUGGINGFACE_API_KEY` | hf_... | (opcjonalnie) |

### CLIENT (Frontend)
| Zmienna | Wartość | Opis |
|---------|---------|------|
| `VITE_API_URL` | https://roleplayserver.up.railway.app | URL API backendu |
| `VITE_SOCKET_URL` | https://roleplayserver.up.railway.app | URL WebSocket |

---

## 6. Troubleshooting

### Problem: "Cannot GET /"
**Przyczyna:** Frontend nie jest zbudowany
**Rozwiązanie:** 
- Sprawdź czy build command jest `npm run build`
- Sprawdź logi deploymentu

### Problem: "Failed to connect to WebSocket"
**Przyczyna:** `VITE_SOCKET_URL` nie jest ustawiony lub jest zły
**Rozwiązanie:**
- Sprawdź czy `VITE_SOCKET_URL` jest ustawiony w CLIENT
- Sprawdź czy backend jest dostępny
- Sprawdź DevTools → Network → WS

### Problem: "401 Unauthorized"
**Przyczyna:** JWT_SECRET jest inny na serwerze
**Rozwiązanie:**
- Sprawdź czy `JWT_SECRET` jest ustawiony na SERVER
- Sprawdź czy token jest wysyłany w requestach

### Problem: "CORS error"
**Przyczyna:** `CLIENT_URL` nie jest ustawiony na SERVER
**Rozwiązanie:**
- Sprawdź czy `CLIENT_URL` jest ustawiony na SERVER
- Sprawdź czy URL jest dokładnie taki sam jak frontend

### Problem: "Database connection failed"
**Przyczyna:** `DATABASE_URL` nie jest ustawiony
**Rozwiązanie:**
- Sprawdź czy PostgreSQL jest dodany do projektu
- Sprawdź czy `DATABASE_URL` jest w Variables
- Sprawdź czy migracje się uruchomiły

---

## 7. Automatyczne Migracje

Dodaliśmy `postinstall` script w `server/package.json`:
```json
"postinstall": "prisma generate && prisma migrate deploy --skip-generate"
```

To automatycznie uruchomi migracje po instalacji zależności na Railway.

---

## 8. Aktualizacja Kodu

Po każdej zmianie kodu:
```bash
git add .
git commit -m "Opis zmian"
git push
```

Railway automatycznie zdetektuje zmiany i zrobi redeploy.

---

## 9. Monitorowanie

### Sprawdzaj Logi
Railway → Deployments → Logs

### Sprawdzaj Metryki
Railway → Metrics (CPU, Memory, Network)

### Sprawdzaj Błędy
Railway → Logs → Filter by "error"

---

## 10. Bezpieczeństwo

- ✅ Zmień `JWT_SECRET` na losowy ciąg
- ✅ Ustaw `NODE_ENV=production`
- ✅ Nie commituj `.env` do gita
- ✅ Używaj Railway Variables zamiast `.env`
- ✅ Regularnie aktualizuj zależności

---

## 11. Wsparcie

Jeśli coś nie działa:
1. Sprawdź logi na Railway
2. Sprawdź DevTools w przeglądarce
3. Sprawdź czy zmienne są ustawione
4. Sprawdź czy baza danych jest dostępna
5. Sprawdź czy frontend się zbudował

---

**Powodzenia! 🚀**
