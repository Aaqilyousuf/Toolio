import { handleRequest } from './routes';
import { startCleanupInterval, rateLimit } from '@toolio/core';

const PORT = 4001;

console.log(`Image Service starting on port ${PORT}...`);

// Start background cleanup
startCleanupInterval();

Bun.serve({
  port: PORT,
  async fetch(req) {
    // IP Rate Limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return new Response('Too Many Requests', { status: 429 });
    }

    return handleRequest(req);
  }
});
