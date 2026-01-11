import { handleRequest } from './routes';
import { startCleanupInterval, rateLimit } from '@toolio/core';

const PORT = 4002;

console.log(`PDF Service starting on port ${PORT}...`);

startCleanupInterval();

Bun.serve({
  port: PORT,
  async fetch(req) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return new Response('Too Many Requests', { status: 429 });
    }
    return handleRequest(req);
  }
});
