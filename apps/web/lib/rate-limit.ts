const WINDOW = 60_000;
const MAX_REQUESTS = 10;

const store = new Map<string, { count: number; expires: number }>();

export function rateLimit(key: string) {
  const existing = store.get(key);
  const now = Date.now();
  if (existing && existing.expires > now) {
    if (existing.count >= MAX_REQUESTS) {
      return false;
    }
    existing.count += 1;
    return true;
  }
  store.set(key, { count: 1, expires: now + WINDOW });
  return true;
}
