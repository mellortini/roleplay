# ❓ FAQ - Deployment na Railway

## Ogólne Pytania

### P: Ile kosztuje Railway?
**O:** Railway ma darmowy tier z limitami. Płacisz za to co zużyjesz (pay-as-you-go). Dla małych aplikacji to ~$5-10/miesiąc.

### P: Czy mogę deployować z GitHub?
**O:** Tak! Railway integruje się z GitHub. Każdy push automatycznie triggeruje deploy.

### P: Jak długo trwa deploy?
**O:** Zwykle 2-5 minut. Zależy od rozmiaru aplikacji i szybkości internetu.

### P: Czy mogę mieć wiele środowisk (dev, staging, prod)?
**O:** Tak! Utwórz osobne projekty na Railway dla każdego środowiska.

---

## Zmienne Środowiskowe

### P: Gdzie ustawić zmienne?
**O:** Railway → Projekt → Variables

### P: Czy zmienne są bezpieczne?
**O:** Tak! Railway szyfruje zmienne. Nie są widoczne w logach ani w kodzie.

### P: Czy mogę zmienić zmienną bez redeploy?
**O:** Nie. Zmiana zmiennej triggeruje automatyczny redeploy.

### P: Jak wygenerować JWT_SECRET?
**O:** 
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Lub użyj: `node generate-jwt-secret.js`

### P: Czy mogę mieć różne JWT_SECRET dla dev i prod?
**O:** Tak! Utwórz osobne projekty na Railway.

---

## WebSocket

### P: Dlaczego WebSocket nie łączy się?
**O:** Możliwe przyczyny:
1. `VITE_SOCKET_URL` nie jest ustawiony
2. URL jest `https://` zamiast `wss://`
3. Backend nie słucha na WebSocket
4. CORS nie pozwala na połączenie

### P: Jak sprawdzić czy WebSocket działa?
**O:** 
1. Otwórz DevTools (F12)
2. Network → WS
3. Zaloguj się
4. Powinieneś zobaczyć połączenie

### P: Czy WebSocket musi być na tym samym URL co API?
**O:** Tak! Socket.io działa na tym samym porcie co Express.

### P: Czy mogę mieć WebSocket na innym porcie?
**O:** Nie na Railway. Musisz użyć tego samego portu.

---

## Baza Danych

### P: Jak dodać PostgreSQL?
**O:** 
1. Railway → Projekt → "+ Add"
2. "Add Database" → "PostgreSQL"
3. Railway automatycznie doda `DATABASE_URL`

### P: Czy mogę używać inną bazę danych?
**O:** Tak! Railway wspiera: PostgreSQL, MySQL, MongoDB, Redis

### P: Jak wykonać migracje?
**O:** Dodaliśmy `postinstall` script. Migracje uruchamiają się automatycznie.

### P: Czy mogę mieć backup bazy danych?
**O:** Tak! Railway automatycznie robi backupy. Możesz je pobrać.

### P: Jak się połączyć do bazy z lokalnego komputera?
**O:** 
1. Railway → PostgreSQL → Connect
2. Skopiuj connection string
3. Użyj w pgAdmin lub DBeaver

---

## Frontend

### P: Gdzie deployować frontend?
**O:** Na osobnym projekcie Railway. Lub na Vercel/Netlify.

### P: Jak ustawić zmienne Vite?
**O:** Railway → Variables. Zmienne Vite muszą być ustawione PRZED build!

### P: Czy frontend musi być na tym samym URL co backend?
**O:** Nie! Mogą być na różnych URL-ach. Ważne jest aby CORS był skonfigurowany.

### P: Jak zmienić port frontendu?
**O:** Railway automatycznie przydzielą port. Możesz go zobaczyć w Deployments.

### P: Czy mogę deployować frontend na Vercel zamiast Railway?
**O:** Tak! Ale pamiętaj aby ustawić `VITE_API_URL` na Vercel.

---

## Backend

### P: Gdzie deployować backend?
**O:** Na projekcie Railway z PostgreSQL.

### P: Jak zmienić port backendu?
**O:** Ustaw `PORT` w Variables. Railway automatycznie przydzielą port.

### P: Czy mogę mieć wiele instancji backendu?
**O:** Tak! Ustaw `numReplicas` w `railway.json`.

### P: Jak skalować aplikację?
**O:** 
1. Zwiększ CPU/Memory w Railway Settings
2. Dodaj repliki w railway.json
3. Dodaj cache (Redis)

---

## Błędy

### P: "Cannot GET /"
**O:** Frontend nie jest zbudowany. Sprawdź build logs.

### P: "Failed to connect to WebSocket"
**O:** WebSocket URL jest zły. Sprawdź `VITE_SOCKET_URL`.

### P: "401 Unauthorized"
**O:** JWT_SECRET jest inny. Sprawdź czy jest ustawiony na SERVER.

### P: "CORS error"
**O:** `CLIENT_URL` nie jest ustawiony. Sprawdź Variables na SERVER.

### P: "Database connection failed"
**O:** `DATABASE_URL` nie jest ustawiony. Dodaj PostgreSQL.

### P: "Prisma migration failed"
**O:** Baza danych nie istnieje. Sprawdź czy PostgreSQL jest dodany.

### P: "npm ERR! code ENOENT"
**O:** Brakuje pliku. Sprawdź czy wszystkie pliki są w repozytorium.

---

## Logi i Debugging

### P: Gdzie sprawdzić logi?
**O:** Railway → Deployments → Logs

### P: Jak filtrować logi?
**O:** Railway → Logs → Filter by "error" / "warning"

### P: Czy mogę pobrać logi?
**O:** Tak! Railway → Logs → Download

### P: Jak debugować WebSocket?
**O:** 
1. DevTools → Network → WS
2. DevTools → Console
3. Railway → Logs

### P: Jak sprawdzić metryki?
**O:** Railway → Metrics (CPU, Memory, Network)

---

## Aktualizacje

### P: Jak zaktualizować kod?
**O:** 
```bash
git add .
git commit -m "Opis zmian"
git push
```
Railway automatycznie zrobi redeploy.

### P: Jak zaktualizować zależności?
**O:** 
```bash
npm update
git push
```

### P: Czy mogę wycofać deploy?
**O:** Tak! Railway → Deployments → Rollback

### P: Jak zapauzować aplikację?
**O:** Railway → Settings → Pause

---

## Bezpieczeństwo

### P: Czy moje dane są bezpieczne?
**O:** Tak! Railway szyfruje dane. Zmienne są bezpieczne.

### P: Czy mogę mieć SSL/TLS?
**O:** Tak! Railway automatycznie daje SSL dla wszystkich domen.

### P: Czy mogę mieć custom domenę?
**O:** Tak! Railway → Settings → Custom Domain

### P: Czy mogę mieć firewall?
**O:** Railway ma wbudowany firewall. Możesz dodać IP whitelist.

### P: Czy mogę mieć VPN?
**O:** Nie bezpośrednio. Ale możesz użyć Railway Private Network.

---

## Koszty

### P: Ile kosztuje Railway?
**O:** 
- Darmowy tier: $5/miesiąc kredytu
- Potem: pay-as-you-go (~$0.000463/CPU-hour)

### P: Jak obniżyć koszty?
**O:** 
1. Zmniejsz CPU/Memory
2. Zmniejsz liczbę replik
3. Użyj mniejszą bazę danych
4. Wyłącz aplikację gdy nie używasz

### P: Czy mogę mieć alert na koszty?
**O:** Tak! Railway → Settings → Billing Alerts

---

## Wsparcie

### P: Gdzie szukać pomocy?
**O:** 
1. Railway Docs: https://docs.railway.app
2. Railway Discord: https://discord.gg/railway
3. GitHub Issues
4. Stack Overflow

### P: Czy Railway ma support?
**O:** Tak! Railway → Support (dla płatnych planów)

---

## Dodatkowe Zasoby

- 📚 [Railway Docs](https://docs.railway.app)
- 🎥 [Railway YouTube](https://www.youtube.com/c/Railway)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [Railway GitHub](https://github.com/railwayapp)

---

**Masz więcej pytań? Sprawdź logi! 🔍**
