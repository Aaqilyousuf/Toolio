import { createJobDir, runCommand, deleteJobDir, validateFile, metrics } from '@toolio/core';
import { join } from 'path';

export const ImageService = {
  async compress(file: Blob, quality: number = 80): Promise<string> {
    const { jobId, path } = await createJobDir('image-service');
    const fileName = (file as any).name || 'image';
    const inputPath = join(path, `input-${fileName}`);
    const outputPath = join(path, 'output.jpg');

    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? 'magick' : 'convert';

    try {
      await Bun.write(inputPath, file);
      
      const start = Date.now();
      await runCommand([cmd, inputPath, '-quality', quality.toString(), outputPath]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'image_compress' });
      metrics.increment('tool_usage_total', { tool: 'image_compress' });

      // After returning the path, the caller (route) is responsible for reading the file and then scheduling cleanup
      // Or we can rely on the cron cleanup, but explicit cleanup after stream completion is better.
      // For now, we return path and let the route handle reading.
      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'image_compress' });
      // cleanup on error immediately
      deleteJobDir(path);
      throw e;
    }
  },

  async toPdf(files: Blob[]): Promise<string> {
    const { jobId, path } = await createJobDir('image-service');
    const inputPaths: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        // Force jpg extension for simplicity or try to keep original logic if possible
        const p = join(path, `input-${i}.jpg`); 
        await Bun.write(p, files[i]);
        inputPaths.push(p);
      }

      const outputPath = join(path, 'output.pdf');
      
      const isWindows = process.platform === 'win32';
      const cmd = isWindows ? 'magick' : 'convert';
      
      const start = Date.now();
      // convert *.jpg -page A4 output.pdf
      // Using specific file list is safer than wildcard
      await runCommand([cmd, ...inputPaths, '-page', 'A4', outputPath]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'image_to_pdf' });
      metrics.increment('tool_usage_total', { tool: 'image_to_pdf' });

      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'image_to_pdf' });
      deleteJobDir(path);
      throw e;
    }
  }
};
