import { PdfService } from './service';
import { validateFile, deleteJobDir, metrics } from '@toolio/core';
import { dirname } from 'path';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const PDF_TYPES = ['application/pdf'];
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

  try {
    if (req.method === 'POST') {
      const formData = await req.formData();

      // Merge
      if (url.pathname === '/api/pdf/merge') {
        const files = formData.getAll('files') as Blob[];
        if (files.length < 2) throw new Error('At least 2 PDF files required');
        const outputPath = await PdfService.merge(files);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="merged.pdf"' } });
      }

      // Split
      if (url.pathname === '/api/pdf/split') {
        const file = formData.get('file') as Blob;
        const start = parseInt(formData.get('start') as string);
        const end = parseInt(formData.get('end') as string);
        if (!file || isNaN(start) || isNaN(end)) throw new Error('File and page range required');
        const outputPath = await PdfService.split(file, start, end);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="split.pdf"' } });
      }

      // Compress
      if (url.pathname === '/api/pdf/compress') {
        const file = formData.get('file') as Blob;
        const level = (formData.get('level') as string) || 'screen';
        const outputPath = await PdfService.compress(file, level);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="compressed.pdf"' } });
      }

      // PDF to Images
      if (url.pathname === '/api/pdf/to-images') {
        const file = formData.get('file') as Blob;
        const outputPath = await PdfService.pdfToImages(file);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="images.zip"' } });
      }

      // Images to PDF
      if (url.pathname === '/api/pdf/images-to-pdf') {
        const files = formData.getAll('files') as Blob[];
        const outputPath = await PdfService.imagesToPdf(files);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="images.pdf"' } });
      }

      // Rotate
      if (url.pathname === '/api/pdf/rotate') {
        const file = formData.get('file') as Blob;
        const rotation = parseInt(formData.get('rotation') as string) || 90;
        const outputPath = await PdfService.rotate(file, rotation);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="rotated.pdf"' } });
      }

      // Extract
      if (url.pathname === '/api/pdf/extract') {
        const file = formData.get('file') as Blob;
        const pagesStr = formData.get('pages') as string;
        const pages = pagesStr.split(',').map(s => parseInt(s.trim())).filter(p => !isNaN(p));
        if (!file || pages.length === 0) throw new Error('File and page numbers required');
        const outputPath = await PdfService.extract(file, pages);
        setTimeout(() => deleteJobDir(dirname(outputPath)), 2 * 60 * 1000);
        return new Response(Bun.file(outputPath), { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="extracted.pdf"' } });
      }
      // Metadata
      if (url.pathname === '/api/pdf/metadata') {
        const file = formData.get('file') as Blob;
        const metadata = await PdfService.getMetadata(file);
        return new Response(JSON.stringify({ success: true, data: metadata }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || 'Internal Server Error' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  return new Response('Not Found', { status: 404 });
};
