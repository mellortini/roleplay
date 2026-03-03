# 🔐 Zmienne Środowiskowe - Pełna Dokumentacja

## 📋 Spis Treści

1. [SERVER (Backend)](#server-backend)
2. [CLIENT (Frontend)](#client-frontend)
3. [Jak Ustawić](#jak-ustawić)
4. [Generowanie Wartości](#generowanie-wartości)
5. [Walidacja](#walidacja)
6. [Troubleshooting](#troubleshooting)

---

## SERVER (Backend)

### Wymagane Zmienne

#### 1. `DATABASE_URL`
**Typ:** String (Connection String)
**Wymagane:** ✅ TAK
**Gdzie:** Railway → PostgreSQL → Connect

```
Przykład:
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway?schema=public
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz SERVER projekt
3. Dodaj PostgreSQL: "+ Add" → "Add Database" → "PostgreSQL"
4. Railway automatycznie doda `DATABASE_URL` do Variables

**Walidacja:**
```bash
# Sprawdź czy baza danych jest dostępna
psql $DATABASE_URL -c "SELECT 1"
```

---

#### 2. `JWT_SECRET`
**Typ:** String (Random Hex)
**Wymagane:** ✅ TAK
**Długość:** Min 32 znaki
**Gdzie:** Railway → Variables

```
Przykład:
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Jak Wygenerować:**
```bash
# Opcja 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opcja 2: Skrypt
node generate-jwt-secret.js

# Opcja 3: OpenSSL
openssl rand -hex 32

# Opcja 4: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz SERVER projekt
3. Wejdź w Variables
4. Dodaj nową zmienną: `JWT_SECRET`
5. Wklej wygenerowany ciąg
6. Kliknij Deploy

**Walidacja:**
```bash
# Sprawdź długość
echo $JWT_SECRET | wc -c  # Powinno być 65 (64 znaki + newline)
```

---

#### 3. `CLIENT_URL`
**Typ:** String (URL)
**Wymagane:** ✅ TAK
**Gdzie:** Railway → Variables

```
Przykład:
https://roleplayclient.up.railway.app
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz SERVER projekt
3. Wejdź w Variables
4. Dodaj nową zmienną: `CLIENT_URL`
5. Wklej URL frontendu
6. Kliknij Deploy

**Walidacja:**
```bash
# Sprawdź czy URL jest dostępny
curl -I $CLIENT_URL
```

---

#### 4. `NODE_ENV`
**Typ:** String (Enum)
**Wymagane:** ✅ TAK
**Wartości:** `development`, `production`, `test`
**Gdzie:** Railway → Variables

```
Wartość dla produkcji:
production
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz SERVER projekt
3. Wejdź w Variables
4. Dodaj nową zmienną: `NODE_ENV`
5. Wklej: `production`
6. Kliknij Deploy

**Wpływ:**
- `production`: Optymalizacje, brak debug logów
- `development`: Debug logów, wolniej
- `test`: Dla testów

---

### Opcjonalne Zmienne

#### 5. `PORT`
**Typ:** Number
**Wymagane:** ❌ NIE
**Domyślnie:** `3001`
**Gdzie:** Railway → Variables

```
Przykład:
3000
```

**Uwaga:** Railway automatycznie przydzielą port. Możesz to pominąć.

---

#### 6. `ANTHROPIC_API_KEY`
**Typ:** String (API Key)
**Wymagane:** ❌ NIE (jeśli używasz AI)
**Gdzie:** Railway → Variables

```
Przykład:
sk-ant-v0-1234567890abcdefghijklmnopqrstuvwxyz
```

**Jak Ustawić:**
1. Wejdź na [console.anthropic.com](https://console.anthropic.com)
2. Utwórz API Key
3. Wejdź na railway.app
4. Otwórz SERVER projekt
5. Wejdź w Variables
6. Dodaj nową zmienną: `ANTHROPIC_API_KEY`
7. Wklej klucz
8. Kliknij Deploy

---

#### 7. `HUGGINGFACE_API_KEY`
**Typ:** String (API Key)
**Wymagane:** ❌ NIE (jeśli używasz AI)
**Gdzie:** Railway → Variables

```
Przykład:
hf_abcdefghijklmnopqrstuvwxyz1234567890
```

**Jak Ustawić:**
1. Wejdź na [huggingface.co](https://huggingface.co)
2. Utwórz API Key
3. Wejdź na railway.app
4. Otwórz SERVER projekt
5. Wejdź w Variables
6. Dodaj nową zmienną: `HUGGINGFACE_API_KEY`
7. Wklej klucz
8. Kliknij Deploy

---

#### 8. `HUGGINGFACE_MODEL`
**Typ:** String (Model Name)
**Wymagane:** ❌ NIE (jeśli używasz HuggingFace)
**Domyślnie:** `meta-llama/Llama-2-7b-chat-hf`
**Gdzie:** Railway → Variables

```
Przykład:
meta-llama/Llama-2-7b-chat-hf
```

**Dostępne Modele:**
- `meta-llama/Llama-2-7b-chat-hf`
- `mistralai/Mistral-7B-Instruct-v0.1`
- `tiiuae/falcon-7b-instruct`

---

## CLIENT (Frontend)

### Wymagane Zmienne

#### 1. `VITE_API_URL`
**Typ:** String (URL)
**Wymagane:** ✅ TAK
**Gdzie:** Railway → Variables

```
Przykład:
https://roleplayserver.up.railway.app
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz CLIENT projekt
3. Wejdź w Variables
4. Dodaj nową zmienną: `VITE_API_URL`
5. Wklej URL backendu
6. Kliknij Deploy

**Walidacja:**
```bash
# Sprawdź czy URL jest dostępny
curl -I $VITE_API_URL/api/health
```

**Uwaga:** Zmienne Vite muszą być ustawione PRZED build!

---

#### 2. `VITE_SOCKET_URL`
**Typ:** String (URL)
**Wymagane:** ✅ TAK
**Gdzie:** Railway → Variables

```
Przykład:
https://roleplayserver.up.railway.app
```

**Jak Ustawić:**
1. Wejdź na railway.app
2. Otwórz CLIENT projekt
3. Wejdź w Variables
4. Dodaj nową zmienną: `VITE_SOCKET_URL`
5. Wklej URL backendu (ten sam co `VITE_API_URL`)
6. Kliknij Deploy

**Konwersja:**
- `https://` → `wss://` (WebSocket Secure)
- `http://` → `ws://` (WebSocket)

**Walidacja:**
```bash
# Sprawdź czy WebSocket jest dostępny
# Otwórz DevTools → Network → WS
# Powinieneś zobaczyć wss://...
```

**Uwaga:** Zmienne Vite muszą być ustawione PRZED build!

---

## Jak Ustawić

### Metoda 1: Railway UI

1. Wejdź na [railway.app](https://railway.app)
2. Otwórz projekt (SERVER lub CLIENT)
3. Wejdź w "Variables"
4. Kliknij "+ Add Variable"
5. Wpisz nazwę zmiennej
6. Wpisz wartość
7. Kliknij "Add"
8. Kliknij "Deploy"

### Metoda 2: Railway CLI

```bash
# Zainstaluj Railway CLI
npm install -g @railway/cli

# Zaloguj się
railway login

# Ustaw zmienną
railway variables set JWT_SECRET=<wartość>

# Sprawdź zmienne
railway variables list

# Deploy
railway deploy
```

### Metoda 3: .env Plik (Lokalnie)

```bash
# server/.env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLIENT_URL=https://roleplayclient.up.railway.app
NODE_ENV=production
```

```bash
# client/.env.local
VITE_API_URL=https://roleplayserver.up.railway.app
VITE_SOCKET_URL=https://roleplayserver.up.railway.app
```

**Uwaga:** Nie commituj `.env` do gita!

---

## Generowanie Wartości

### JWT_SECRET

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Bash
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"

# Skrypt
node generate-jwt-secret.js
```

### API Keys

- **Anthropic:** https://console.anthropic.com/account/keys
- **HuggingFace:** https://huggingface.co/settings/tokens

---

## Walidacja

### Sprawdzenie Zmiennych

```bash
# Railway CLI
railway variables list

# Sprawdzenie w aplikacji
curl https://roleplayserver.up.railway.app/api/health
```

### Sprawdzenie Logów

```
Railway → Deployments → Logs
```

Szukaj:
- `error`
- `failed`
- `undefined`
- `missing`

---

## Troubleshooting

### Problem: "Undefined Variable"
**Przyczyna:** Zmienna nie jest ustawiona
**Rozwiązanie:** Sprawdź Railway → Variables

### Problem: "Invalid JWT"
**Przyczyna:** JWT_SECRET jest inny
**Rozwiązanie:** Ustaw JWT_SECRET na SERVER

### Problem: "CORS Error"
**Przyczyna:** CLIENT_URL jest zły
**Rozwiązanie:** Sprawdź czy CLIENT_URL jest dokładnie taki sam jak frontend URL

### Problem: "WebSocket Connection Failed"
**Przyczyna:** VITE_SOCKET_URL jest zły
**Rozwiązanie:** Sprawdź czy VITE_SOCKET_URL jest ustawiony na CLIENT

### Problem: "Database Connection Failed"
**Przyczyna:** DATABASE_URL jest zły
**Rozwiązanie:** Sprawdź czy PostgreSQL jest dodany do SERVER

---

## Checklist

### SERVER
- [ ] DATABASE_URL (Railway doda)
- [ ] JWT_SECRET (wygeneruj)
- [ ] CLIENT_URL (ustaw)
- [ ] NODE_ENV (ustaw na production)
- [ ] (Opcjonalnie) ANTHROPIC_API_KEY
- [ ] (Opcjonalnie) HUGGINGFACE_API_KEY

### CLIENT
- [ ] VITE_API_URL (ustaw)
- [ ] VITE_SOCKET_URL (ustaw)

---

## Bezpieczeństwo

- ✅ Zmienne są szyfrowane na Railway
- ✅ Nie są widoczne w logach
- ✅ Nie są widoczne w kodzie
- ✅ Nie commituj `.env` do gita
- ✅ Zmień JWT_SECRET na losowy ciąg
- ✅ Używaj HTTPS dla wszystkich URL-ów

---

**Gotowe! 🚀**
