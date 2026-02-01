import { UtilitiesService } from './service';

export const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const startTime = Date.now();

  const jsonResponse = (data: any, status = 200) => {
    const executionTime = Date.now() - startTime;
    console.log(`Tool: ${url.pathname} | Success: ${status === 200} | Time: ${executionTime}ms`);
    return new Response(JSON.stringify({ success: true, data }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const errorResponse = (message: string, status = 400) => {
    console.log(`Tool: ${url.pathname} | Success: false | Error: ${message}`);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  try {
    // OPTIONS for CORS
    if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

    // Request-based tools
    if (url.pathname === '/api/utils/user-agent') {
      return jsonResponse({ userAgent: req.headers.get('user-agent') || 'unknown' });
    }

    if (url.pathname === '/api/utils/ip') {
      return jsonResponse({ ip: req.headers.get('x-forwarded-for') || 'unknown' });
    }

    // System tools
    if (url.pathname === '/api/utils/uuid') {
      return jsonResponse({ uuid: UtilitiesService.getUUID() });
    }

    if (url.pathname === '/api/utils/random') {
      const min = parseInt(url.searchParams.get('min') || '0');
      const max = parseInt(url.searchParams.get('max') || '100');
      if (isNaN(min) || isNaN(max)) return errorResponse('Invalid min/max parameters');
      return jsonResponse({ number: UtilitiesService.getRandomNumber(min, max) });
    }

    // URL tools
    if (url.pathname === '/api/utils/url-encode') {
      const text = url.searchParams.get('text');
      if (!text) return errorResponse('Text parameter required');
      return jsonResponse({ encoded: UtilitiesService.encodeUrl(text) });
    }

    if (url.pathname === '/api/utils/url-decode') {
      const text = url.searchParams.get('text');
      if (!text) return errorResponse('Text parameter required');
      return jsonResponse({ decoded: UtilitiesService.decodeUrl(text) });
    }

    // Network tools
    if (url.pathname === '/api/utils/site-status') {
      const target = url.searchParams.get('url');
      if (!target) return errorResponse('URL parameter required');
      const result = await UtilitiesService.checkWebsiteStatus(target);
      return jsonResponse(result);
    }

    if (url.pathname === '/api/utils/redirects') {
      const target = url.searchParams.get('url');
      if (!target) return errorResponse('URL parameter required');
      const redirects = await UtilitiesService.getRedirects(target);
      return jsonResponse({ redirects });
    }

    if (url.pathname === '/api/utils/unshorten') {
      const target = url.searchParams.get('url');
      if (!target) return errorResponse('URL parameter required');
      const originalUrl = await UtilitiesService.unshortenUrl(target);
      return jsonResponse({ originalUrl });
    }

    if (url.pathname === '/api/utils/headers') {
      const target = url.searchParams.get('url');
      if (!target) return errorResponse('URL parameter required');
      const headers = await UtilitiesService.getHttpHeaders(target);
      return jsonResponse({ headers });
    }

    if (url.pathname === '/api/utils/ping') {
  const input = url.searchParams.get('host');

  if (!input) {
    return errorResponse('Host parameter required');
  }

  let host: string;

  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      host = new URL(input).hostname;
    } else {
      host = input;
    }
  } catch {
    return errorResponse('Invalid host or URL');
  }

  const port = parseInt(url.searchParams.get('port') || '80', 10);
  const result = await UtilitiesService.ping(host, port);
  return jsonResponse(result);
}

    if (url.pathname === '/api/utils/ssl') {
  const input = url.searchParams.get('host');

  if (!input) {
    return errorResponse('Host parameter required');
  }

  let host: string;

  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      host = new URL(input).hostname;
    } else {
      host = input;
    }
  } catch {
    return errorResponse('Invalid host or URL');
  }

  const result = await UtilitiesService.checkSSL(host);
  return jsonResponse(result);
}


    return errorResponse('Not Found', 404);
  } catch (e: any) {
    return errorResponse(e.message || 'Internal Server Error', 500);
  }
};
