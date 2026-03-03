#!/usr/bin/env node

/**
 * Generator JWT_SECRET dla Railway
 * 
 * Użycie:
 * node generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generuj losowy ciąg 32 bajtów (256 bitów)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Wygenerowany JWT_SECRET:\n');
console.log(jwtSecret);
console.log('\n📋 Skopiuj powyższy ciąg i wklej do Railway Variables\n');
console.log('Instrukcja:');
console.log('1. Wejdź na railway.app');
console.log('2. Otwórz projekt SERVER');
console.log('3. Wejdź w Variables');
console.log('4. Dodaj nową zmienną: JWT_SECRET');
console.log('5. Wklej powyższy ciąg');
console.log('6. Kliknij Deploy\n');
