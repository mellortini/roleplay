// Rate limiting dla AI - w pamięci serwera
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Czyszczenie starych wpisów co 5 minut
    setInterval(() => this.cleanUp(), 5 * 60 * 1000);
  }

  canProceed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      // Pierwsze zapytanie
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Okno czasowe się zresetowało
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      // Limit przekroczony
      return false;
    }

    // Zwiększ licznik
    entry.count++;
    return true;
  }

  getTimeToReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  private cleanUp(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Limit dla AI - 10 zapytań na minutę na sesję
export const aiRateLimiter = new RateLimiter(60 * 1000, 10);

// Limit dla generowania postaci - 5 zapytań na minutę na użytkownika
export const characterGenRateLimiter = new RateLimiter(60 * 1000, 5);

export default RateLimiter;
