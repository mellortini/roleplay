# ✅ Deployment Checklist

## 📋 Przed Deploymentem

### Kod
- [ ] Wszystkie zmiany są committed
- [ ] Nie ma błędów w konsoli
- [ ] Testy przechodzą (jeśli są)
- [ ] Build się kompiluje: `npm run build`

### Zmienne
- [ ] Wygeneruj JWT_SECRET: `node generate-jwt-secret.js`
- [ ] Masz URL frontendu (np. `https://roleplayclient.up.railway.app`)
- [ ] Masz URL backendu (np. `https://roleplayserver.up.railway.app`)

---

## 🚀 Deployment - SERVER (Backend)

### Krok 1: Utwórz Projekt
- [ ] Wejdź na [railway.app](https://railway.app)
- [ ] Kliknij "New Project"
- [ ] Wybierz "Deploy from GitHub"
- [ ] Wybierz swoje repozytorium
- [ ] Ustaw root directory na `server`

### Krok 2: Dodaj PostgreSQL
- [ ] Kliknij "+ Add"
- [ ] Wybierz "Add Database"
- [ ] Wybierz "PostgreSQL"
- [ ] Czekaj na dodanie bazy danych
- [ ] Sprawdź czy `DATABASE_URL` pojawił się w Variables

### Krok 3: Ustaw Zmienne
- [ ] Wejdź w Variables
- [ ] Dodaj `JWT_SECRET` (wygenerowany wcześniej)
- [ ] Dodaj `CLIENT_URL=https://roleplayclient.up.railway.app`
- [ ] Dodaj `NODE_ENV=production`
- [ ] (Opcjonalnie) Dodaj `ANTHROPIC_API_KEY` lub `HUGGINGFACE_API_KEY`

### Krok 4: Ustaw Build & Deploy
- [ ] Wejdź w Settings → Build & Deploy
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm run start`
- [ ] Root Directory: `server`

### Krok 5: Deploy
- [ ] Kliknij "Deploy"
- [ ] Czekaj na zakończenie (2-5 minut)
- [ ] Sprawdź logi: Deployments → Logs
- [ ] Szukaj błędów

### Krok 6: Testuj Backend
- [ ] Otwórz: `https://roleplayserver.up.railway.app/api/health`
- [ ] Powinieneś zobaczyć: `{"status":"ok","timestamp":"..."}`
- [ ] Jeśli nie działa - sprawdź logi

---

## 🎨 Deployment - CLIENT (Frontend)

### Krok 1: Utwórz Projekt
- [ ] Wejdź na [railway.app](https://railway.app)
- [ ] Kliknij "New Project"
- [ ] Wybierz "Deploy from GitHub"
- [ ] Wybierz swoje repozytorium
- [ ] Ustaw root directory na `client`

### Krok 2: Ustaw Zmienne
- [ ] Wejdź w Variables
- [ ] Dodaj `VITE_API_URL=https://roleplayserver.up.railway.app`
- [ ] Dodaj `VITE_SOCKET_URL=https://roleplayserver.up.railway.app`
- [ ] **WAŻNE:** Zmienne muszą być ustawione PRZED build!

### Krok 3: Ustaw Build & Deploy
- [ ] Wejdź w Settings → Build & Deploy
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm run start`
- [ ] Root Directory: `client`

### Krok 4: Deploy
- [ ] Kliknij "Deploy"
- [ ] Czekaj na zakończenie (2-5 minut)
- [ ] Sprawdź logi: Deployments → Logs
- [ ] Szukaj błędów

### Krok 5: Testuj Frontend
- [ ] Otwórz: `https://roleplayclient.up.railway.app`
- [ ] Powinieneś zobaczyć stronę logowania
- [ ] Jeśli nie działa - sprawdź logi

---

## 🔗 Testowanie Integracji

### WebSocket
- [ ] Otwórz frontend
- [ ] Otwórz DevTools (F12)
- [ ] Wejdź w Network → WS
- [ ] Zaloguj się
- [ ] Powinieneś zobaczyć połączenie do `wss://roleplayserver.up.railway.app`
- [ ] Jeśli nie ma - sprawdź `VITE_SOCKET_URL`

### Login
- [ ] Spróbuj się zalogować
- [ ] Powinieneś zobaczyć token w localStorage
- [ ] Powinieneś być przekierowany do lobby
- [ ] Jeśli błąd - sprawdź logi backendu

### Gra
- [ ] Spróbuj stworzyć postać
- [ ] Spróbuj stworzyć sesję
- [ ] Spróbuj dołączyć do sesji
- [ ] Spróbuj wysłać wiadomość
- [ ] Wszystko powinno działać bez błędów

---

## 🐛 Troubleshooting

### Jeśli Backend Nie Działa
- [ ] Sprawdź logi: Railway → Deployments → Logs
- [ ] Szukaj: "error", "failed", "exception"
- [ ] Sprawdź czy zmienne są ustawione
- [ ] Sprawdź czy PostgreSQL jest dodany
- [ ] Sprawdź czy migracje się uruchomiły

### Jeśli Frontend Nie Działa
- [ ] Sprawdź logi: Railway → Deployments → Logs
- [ ] Szukaj: "error", "failed", "exception"
- [ ] Sprawdź czy zmienne są ustawione
- [ ] Sprawdź czy build się kompiluje
- [ ] Sprawdź czy `npm run build` działa lokalnie

### Jeśli WebSocket Nie Łączy Się
- [ ] Sprawdź DevTools → Console
- [ ] Szukaj: "WebSocket", "connection", "error"
- [ ] Sprawdź czy `VITE_SOCKET_URL` jest ustawiony
- [ ] Sprawdź czy backend jest dostępny
- [ ] Sprawdź czy CORS jest skonfigurowany

### Jeśli Login Nie Działa
- [ ] Sprawdź DevTools → Network
- [ ] Sprawdź czy request do `/api/auth/login` zwraca 200
- [ ] Sprawdź czy token jest w response
- [ ] Sprawdź czy token jest zapisany w localStorage
- [ ] Sprawdź logi backendu

---

## 📊 Monitoring

### Codziennie
- [ ] Sprawdź czy aplikacja jest dostępna
- [ ] Sprawdź czy nie ma błędów w logach
- [ ] Sprawdź metryki: CPU, Memory, Network

### Co Tydzień
- [ ] Sprawdź czy są aktualizacje zależności
- [ ] Sprawdź czy baza danych rośnie
- [ ] Sprawdź czy są problemy z wydajnością

### Co Miesiąc
- [ ] Sprawdź koszty na Railway
- [ ] Sprawdź czy backup bazy danych działa
- [ ] Sprawdź czy są bezpieczeństwo problemy

---

## 🔐 Bezpieczeństwo

- [ ] JWT_SECRET jest losowy (min 32 znaki)
- [ ] NODE_ENV=production
- [ ] Nie commitujesz `.env` do gita
- [ ] Zmienne są w Railway Variables, nie w kodzie
- [ ] CORS jest skonfigurowany na dokładny URL
- [ ] Hasła są hashowane (bcrypt)
- [ ] Tokeny mają expiration time

---

## 📝 Dokumentacja

- [ ] Przeczytaj `QUICK_FIX.md`
- [ ] Przeczytaj `DEPLOYMENT_ANALYSIS.md`
- [ ] Przeczytaj `RAILWAY_SETUP.md`
- [ ] Przeczytaj `ARCHITECTURE.md`
- [ ] Przeczytaj `FAQ_DEPLOYMENT.md`

---

## 🎉 Gotowe!

Jeśli wszystkie checkboxy są zaznaczone, Twoja aplikacja powinna działać na Railway!

### Ostatnie Kroki
1. Podziel się linkami:
   - Frontend: `https://roleplayclient.up.railway.app`
   - Backend: `https://roleplayserver.up.railway.app`

2. Testuj z przyjaciółmi

3. Raportuj błędy

4. Iteruj i ulepszaj

---

## 🆘 Potrzebujesz Pomocy?

1. Sprawdź `FAQ_DEPLOYMENT.md`
2. Sprawdź logi na Railway
3. Sprawdź DevTools w przeglądarce
4. Sprawdź GitHub Issues
5. Zapytaj na Railway Discord

---

**Powodzenia! 🚀**
