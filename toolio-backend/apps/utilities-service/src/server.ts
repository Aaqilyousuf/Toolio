import { handleRequest } from './routes';
import { rateLimit } from '@toolio/core';

const PORT = 4005;

console.log(`Utilities Service starting on port ${PORT}...`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // In-memory rate limiting from core
    if (!rateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Add CORS headers to all responses
    const response = await handleRequest(req);
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
});
