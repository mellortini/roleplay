# Roleplay App - Skrypt startowy
# Ten skrypt pomoże Ci uruchomić aplikację

Write-Host "🎮 Roleplay - Tekstowa Gra RPG" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy Node.js jest zainstalowany
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js znaleziony: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js nie jest zainstalowany!" -ForegroundColor Red
    Write-Host "   Pobierz z: https://nodejs.org/ (zalecana wersja 18+)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Konfiguracja bazy danych:" -ForegroundColor Yellow
Write-Host "   Masz 3 opcje:" -ForegroundColor White
Write-Host "   1. Railway.app (polecane) - darmowa baza PostgreSQL w chmurze" -ForegroundColor White
Write-Host "      Wejdź na: https://railway.app" -ForegroundColor Cyan
Write-Host "      Stwórz projekt → New → Database → Add PostgreSQL" -ForegroundColor White
Write-Host "      Skopiuj DATABASE_URL do server/.env" -ForegroundColor White
Write-Host ""
Write-Host "   2. Neon.tech - darmowa baza PostgreSQL" -ForegroundColor White
Write-Host "      Wejdź na: https://neon.tech" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. Lokalny PostgreSQL" -ForegroundColor White
Write-Host "      Instalacja: https://www.postgresql.org/download/" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy .env jest skonfigurowany
$envContent = Get-Content -Path ".\server\.env" -Raw
if ($envContent -match "user:password@localhost" -or $envContent -match "postgres:password@containers-us-west") {
    Write-Host "⚠️  UWAGA: Musisz skonfigurować DATABASE_URL w pliku server/.env" -ForegroundColor Red
    Write-Host "   Aktualna wartość to przykład/temporalna." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Naciśnij ENTER gdy skonfigurujesz bazę danych..."
Read-Host

Write-Host ""
Write-Host "🔧 Instalacja zależności backend..." -ForegroundColor Yellow
Set-Location server
npm install

Write-Host ""
Write-Host "🔄 Generowanie klienta Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "🔄 Migracja bazy danych..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init
    Write-Host "✅ Migracja zakończona pomyślnie!" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd migracji. Sprawdź czy DATABASE_URL jest poprawny." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "🔧 Instalacja zależności frontend..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

Write-Host ""
Write-Host "🚀 Uruchamianie aplikacji..." -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Naciśnij CTRL+C aby zatrzymać" -ForegroundColor Yellow
Write-Host ""

# Uruchom wszystko
npm run dev
