import { PdfService } from './service';
import { validateFile, deleteJobDir, metrics } from '@toolio/core';
import { dirname } from 'path';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['application/pdf'];

export const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (req.method === 'GET' && url.pathname === '/metrics') {
      return new Response(metrics.getMetrics(), { headers: { 'Content-Type': 'text/plain' } });
  }
  
  // CORS
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
    if (req.method === 'POST' && url.pathname === '/api/pdf/merge') {
      const formData = await req.formData();
      const files = formData.getAll('files') as Blob[];

      if (!files || files.length < 2) return new Response('At least 2 PDF files required', { status: 400 });

      for (const f of files) {
          const error = validateFile(f, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
          if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const outputPath = await PdfService.merge(files);

      setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

      return new Response(Bun.file(outputPath), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="merged.pdf"',
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
