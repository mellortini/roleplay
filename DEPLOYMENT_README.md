# 🚀 Deployment na Railway - Dokumentacja

## 📚 Spis Treści

1. **[QUICK_FIX.md](./QUICK_FIX.md)** - Szybka naprawa (START TUTAJ!)
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Krok po kroku checklist
3. **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)** - Pełna instrukcja konfiguracji
4. **[DEPLOYMENT_ANALYSIS.md](./DEPLOYMENT_ANALYSIS.md)** - Analiza problemów
5. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagram i architektura
6. **[FAQ_DEPLOYMENT.md](./FAQ_DEPLOYMENT.md)** - Pytania i odpowiedzi
7. **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Podsumowanie zmian

---

## 🎯 Gdzie Zacząć?

### Jeśli Masz 5 Minut
👉 Przeczytaj **[QUICK_FIX.md](./QUICK_FIX.md)**

### Jeśli Masz 30 Minut
👉 Przeczytaj **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

### Jeśli Chcesz Zrozumieć Wszystko
👉 Przeczytaj **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)**

### Jeśli Masz Problem
👉 Sprawdź **[FAQ_DEPLOYMENT.md](./FAQ_DEPLOYMENT.md)**

---

## 🔧 Zmienione Pliki

### 1. `client/src/hooks/useSocket.ts`
- ✅ WebSocket URL konwersja (https:// → wss://)

### 2. `server/package.json`
- ✅ Postinstall script dla migracji Prisma

### 3. `railway.json` (NOWY)
- ✅ Konfiguracja Railway

---

## 📋 Zmienne Środowiskowe

### SERVER (Backend)
```
DATABASE_URL=<Railway doda>
JWT_SECRET=<wygeneruj>
CLIENT_URL=https://roleplayclient.up.railway.app
NODE_ENV=production
```

### CLIENT (Frontend)
```
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

---

## ⚡ Szybki Start

### 1. Wygeneruj JWT_SECRET
```bash
node generate-jwt-secret.js
```

### 2. Utwórz Projekty na Railway
- SERVER: root = `server`
- CLIENT: root = `client`

### 3. Ustaw Zmienne
- SERVER: DATABASE_URL, JWT_SECRET, CLIENT_URL, NODE_ENV
- CLIENT: VITE_API_URL, VITE_SOCKET_URL

### 4. Deploy
```bash
git push
```

### 5. Testuj
- Backend: `https://roleplayserver.up.railway.app/api/health`
- Frontend: `https://roleplayclient.up.railway.app`

---

## 🐛 Najczęstsze Problemy

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| WebSocket nie łączy się | `https://` zamiast `wss://` | Sprawdź `VITE_SOCKET_URL` |
| CORS error | `CLIENT_URL` nie ustawiony | Ustaw `CLIENT_URL` na SERVER |
| 401 Unauthorized | `JWT_SECRET` inny | Ustaw `JWT_SECRET` na SERVER |
| Database error | `DATABASE_URL` nie ustawiony | Dodaj PostgreSQL |
| Cannot GET / | Frontend nie zbudowany | Sprawdź build logs |

---

## 📊 Struktura Dokumentacji

```
DEPLOYMENT_README.md (ten plik)
├── QUICK_FIX.md (5 min)
├── DEPLOYMENT_CHECKLIST.md (30 min)
├── RAILWAY_SETUP.md (1 godzina)
├── DEPLOYMENT_ANALYSIS.md (analiza)
├── ARCHITECTURE.md (diagram)
├── FAQ_DEPLOYMENT.md (pytania)
└── CHANGES_SUMMARY.md (podsumowanie)
```

---

## 🎓 Nauka

### Dla Początkujących
1. Przeczytaj QUICK_FIX.md
2. Przeczytaj DEPLOYMENT_CHECKLIST.md
3. Postępuj krok po kroku

### Dla Zaawansowanych
1. Przeczytaj DEPLOYMENT_ANALYSIS.md
2. Przeczytaj ARCHITECTURE.md
3. Dostosuj do swoich potrzeb

### Dla DevOps
1. Przeczytaj ARCHITECTURE.md
2. Przeczytaj railway.json
3. Skonfiguruj monitoring

---

## 🔗 Linki

- 🌐 [Railway.app](https://railway.app)
- 📚 [Railway Docs](https://docs.railway.app)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [Railway GitHub](https://github.com/railwayapp)

---

## ✅ Checklist Przed Deploymentem

- [ ] Przeczytaj QUICK_FIX.md
- [ ] Wygeneruj JWT_SECRET
- [ ] Utwórz projekty na Railway
- [ ] Ustaw zmienne
- [ ] Zrób git push
- [ ] Testuj aplikację
- [ ] Sprawdź logi jeśli coś nie działa

---

## 🎉 Powodzenia!

Jeśli masz pytania, sprawdź FAQ_DEPLOYMENT.md lub logi na Railway.

**Happy Deploying! 🚀**
