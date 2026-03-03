# 🎯 START TUTAJ - Deployment na Railway

## 📌 TL;DR (Zbyt Długo; Nie Czytałem)

Twoja aplikacja nie działa na Railway z powodu **3 głównych problemów**:

1. ❌ **WebSocket URL** - używa `https://` zamiast `wss://`
2. ❌ **Zmienne środowiskowe** - nie są ustawione na Railway
3. ❌ **Migracje bazy danych** - nie uruchamiają się automatycznie

**Rozwiązanie:** Już naprawiliśmy kod! Teraz musisz tylko ustawić zmienne na Railway.

---

## ⚡ Szybka Naprawa (5 minut)

### Krok 1: Wygeneruj JWT_SECRET
```bash
node generate-jwt-secret.js
```
Skopiuj wynik (32-znakowy ciąg)

### Krok 2: Ustaw Zmienne na Railway

**SERVER (Backend):**
```
DATABASE_URL = <Railway doda automatycznie>
JWT_SECRET = <wklej z kroku 1>
CLIENT_URL = https://roleplayclient.up.railway.app
NODE_ENV = production
```

**CLIENT (Frontend):**
```
VITE_API_URL = https://roleplayserver.up.railway.app
VITE_SOCKET_URL = https://roleplayserver.up.railway.app
```

### Krok 3: Zrób Redeploy
```bash
git add .
git commit -m "Fix deployment"
git push
```

### Krok 4: Testuj
- Backend: `https://roleplayserver.up.railway.app/api/health`
- Frontend: `https://roleplayclient.up.railway.app`

---

## 📚 Dokumentacja

| Plik | Czas | Dla Kogo |
|------|------|----------|
| **[QUICK_FIX.md](./QUICK_FIX.md)** | 5 min | Wszyscy |
| **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** | 10 min | Wizualni |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | 30 min | Szczegółowo |
| **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)** | 1 h | Pełnie |
| **[FAQ_DEPLOYMENT.md](./FAQ_DEPLOYMENT.md)** | Na żądanie | Pytania |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 30 min | Architektura |
| **[DEPLOYMENT_ANALYSIS.md](./DEPLOYMENT_ANALYSIS.md)** | 30 min | Analiza |

---

## 🔧 Co Zostało Naprawione

### ✅ Kod
1. **`client/src/hooks/useSocket.ts`** - WebSocket URL konwersja
   - `https://` → `wss://`
   - `http://` → `ws://`

2. **`server/package.json`** - Postinstall script
   - Migracje Prisma uruchamiają się automatycznie

3. **`railway.json`** - Konfiguracja Railway (nowy plik)

### ✅ Dokumentacja
- 8 nowych plików z instrukcjami
- Checklist, FAQ, Architektura, Troubleshooting

---

## 🚀 Następne Kroki

### Jeśli Masz 5 Minut
1. Przeczytaj ten plik
2. Wygeneruj JWT_SECRET
3. Ustaw zmienne na Railway
4. Zrób git push

### Jeśli Masz 30 Minut
1. Przeczytaj [QUICK_FIX.md](./QUICK_FIX.md)
2. Przeczytaj [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. Postępuj krok po kroku

### Jeśli Chcesz Zrozumieć Wszystko
1. Przeczytaj [DEPLOYMENT_ANALYSIS.md](./DEPLOYMENT_ANALYSIS.md)
2. Przeczytaj [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Przeczytaj [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

---

## 🎯 Zmienne Środowiskowe

### SERVER
```
DATABASE_URL = postgresql://...  (Railway doda)
JWT_SECRET = <losowy-32-znaki>   (wygeneruj)
CLIENT_URL = https://roleplayclient.up.railway.app
NODE_ENV = production
```

### CLIENT
```
VITE_API_URL = https://roleplayserver.up.railway.app
VITE_SOCKET_URL = https://roleplayserver.up.railway.app
```

---

## 🐛 Jeśli Coś Nie Działa

### WebSocket nie łączy się
- Sprawdź czy `VITE_SOCKET_URL` jest ustawiony
- Sprawdź DevTools → Network → WS

### CORS error
- Sprawdź czy `CLIENT_URL` jest ustawiony na SERVER
- Sprawdź czy URL jest dokładnie taki sam

### 401 Unauthorized
- Sprawdź czy `JWT_SECRET` jest ustawiony na SERVER
- Sprawdź czy token jest wysyłany

### Database error
- Sprawdź czy PostgreSQL jest dodany do SERVER
- Sprawdź czy `DATABASE_URL` jest w Variables

### Inne problemy
- Sprawdź logi: Railway → Deployments → Logs
- Sprawdź [FAQ_DEPLOYMENT.md](./FAQ_DEPLOYMENT.md)

---

## 📊 Struktura Projektu

```
roleplay/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useSocket.ts ✅ NAPRAWIONY
│   │   └── ...
│   └── package.json
│
├── server/                 # Backend (Node.js)
│   ├── src/
│   │   └── ...
│   ├── package.json ✅ NAPRAWIONY
│   └── prisma/
│       └── schema.prisma
│
├── railway.json ✅ NOWY
├── generate-jwt-secret.js ✅ NOWY
├── DEPLOYMENT_README.md ✅ NOWY
├── QUICK_FIX.md ✅ NOWY
├── VISUAL_GUIDE.md ✅ NOWY
├── DEPLOYMENT_CHECKLIST.md ✅ NOWY
├── RAILWAY_SETUP.md ✅ NOWY
├── DEPLOYMENT_ANALYSIS.md ✅ NOWY
├── ARCHITECTURE.md ✅ NOWY
├── FAQ_DEPLOYMENT.md ✅ NOWY
├── CHANGES_SUMMARY.md ✅ NOWY
└── START_HERE.md (ten plik) ✅ NOWY
```

---

## ✅ Checklist

- [ ] Przeczytaj ten plik
- [ ] Wygeneruj JWT_SECRET: `node generate-jwt-secret.js`
- [ ] Ustaw zmienne na Railway (SERVER i CLIENT)
- [ ] Zrób git push
- [ ] Czekaj na deploy (2-5 minut)
- [ ] Testuj aplikację
- [ ] Jeśli coś nie działa - sprawdź logi

---

## 🎉 Gotowe!

Po wykonaniu powyższych kroków Twoja aplikacja powinna działać na Railway!

### Linki
- 🌐 Frontend: `https://roleplayclient.up.railway.app`
- 🔧 Backend: `https://roleplayserver.up.railway.app`
- 📊 API Health: `https://roleplayserver.up.railway.app/api/health`

---

## 📞 Potrzebujesz Pomocy?

1. **Szybka pomoc:** Przeczytaj [QUICK_FIX.md](./QUICK_FIX.md)
2. **Krok po kroku:** Przeczytaj [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Pytania:** Sprawdź [FAQ_DEPLOYMENT.md](./FAQ_DEPLOYMENT.md)
4. **Logi:** Railway → Deployments → Logs
5. **DevTools:** F12 → Console → Network

---

## 🚀 Powodzenia!

Jeśli masz pytania, sprawdź dokumentację lub logi na Railway.

**Happy Deploying! 🎉**

---

**Ostatnia aktualizacja:** 3 marca 2024
**Status:** ✅ Gotowe do deploymentu
