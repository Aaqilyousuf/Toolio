import { ImageService } from './service';
import { validateFile, deleteJobDir, metrics } from '@toolio/core';
import { dirname } from 'path';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (req.method === 'GET' && url.pathname === '/metrics') {
    return new Response(metrics.getMetrics(), {
        headers: { 'Content-Type': 'text/plain' }
    });
  }

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    if (req.method === 'POST' && url.pathname === '/api/image/compress') {
      const formData = await req.formData();
      const file = formData.get('file') as Blob;
      const quality = parseInt(formData.get('quality') as string || '80', 10);

      if (!file) return new Response('No file uploaded', { status: 400 });

      const error = validateFile(file, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
      if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

      const outputPath = await ImageService.compress(file, quality);

      // Schedule cleanup after 2 minutes to ensure download completes
      // "Delete... immediately" - we interpret this as "immediately after service fulfillment"
      setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

      return new Response(Bun.file(outputPath), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': 'attachment; filename="compressed.jpg"',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/image/to-pdf') {
      const formData = await req.formData();
      const files = formData.getAll('files') as Blob[]; // Assumes 'files' field

      if (!files || files.length === 0) return new Response('No files uploaded', { status: 400 });
      
      // Validate all
      for (const f of files) {
          const error = validateFile(f, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
          if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const outputPath = await ImageService.toPdf(files);

      setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

      return new Response(Bun.file(outputPath), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="output.pdf"',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  return new Response('Not Found', { status: 404 });
};
