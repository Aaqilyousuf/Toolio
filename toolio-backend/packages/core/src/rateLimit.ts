const hits = new Map<string, number>();
const RESET_INTERVAL = 60000; // 1 min
const LIMIT = 100; // 100 requests per minute

// Periodically clear
setInterval(() => {
  hits.clear();
}, RESET_INTERVAL);

export function rateLimit(ip: string): boolean {
  const count = hits.get(ip) || 0;
  if (count >= LIMIT) return false;
  hits.set(ip, count + 1);
  return true;
}
