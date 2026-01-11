import { VideoService } from './service';
import { validateFile, deleteJobDir, metrics } from '@toolio/core';
import { dirname } from 'path';

const MAX_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', // Video
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/x-m4a', 'audio/mp4', 'audio/aac' // Audio
];

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
    if (req.method === 'POST') {
        const formData = await req.formData();
        
        if (url.pathname === '/api/video/trim') {
            const file = formData.get('file') as Blob;
            const start = formData.get('start') as string;
            const end = formData.get('end') as string;

            if (!file || !start || !end) return new Response('Missing file, start or end params', { status: 400 });

            const error = validateFile(file, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
            if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

            const outputPath = await VideoService.trim(file, start, end);
            setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

            return new Response(Bun.file(outputPath), {
                headers: {
                    'Content-Type': 'video/mp4',
                    'Content-Disposition': 'attachment; filename="trimmed.mp4"',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        if (url.pathname === '/api/video/to-audio') {
            const file = formData.get('file') as Blob;
            const bitrate = (formData.get('bitrate') as any) || 'medium';

            if (!file) return new Response('No file uploaded', { status: 400 });
             const error = validateFile(file, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
            if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

            const outputPath = await VideoService.toAudio(file, bitrate);
            setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

            return new Response(Bun.file(outputPath), {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': 'attachment; filename="audio.mp3"',
                     'Access-Control-Allow-Origin': '*'
                }
            });
        }

        if (url.pathname === '/api/audio/convert') {
            const file = formData.get('file') as Blob;
            const format = formData.get('format') as string || 'mp3';

            if (!file) return new Response('No file uploaded', { status: 400 });

            const error = validateFile(file, { maxSize: MAX_SIZE, allowedMimeTypes: ALLOWED_TYPES });
            if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            
            const outputPath = await VideoService.convertAudio(file, format);
            setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);

            return new Response(Bun.file(outputPath), {
                headers: {
                    'Content-Type': `audio/${format}`,
                    'Content-Disposition': `attachment; filename="converted.${format}"`,
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
  } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
  }

  return new Response('Not Found', { status: 404 });
}
