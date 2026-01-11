import { createJobDir, runCommand, deleteJobDir, metrics } from '@toolio/core';
import { join } from 'path';

export const PdfService = {
  async merge(files: Blob[]): Promise<string> {
    const { jobId, path } = await createJobDir('pdf-service');
    const inputPaths: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const p = join(path, `input-${i}.pdf`);
        await Bun.write(p, files[i]);
        inputPaths.push(p);
      }

      const outputPath = join(path, 'merged.pdf');
      
      const start = Date.now();
      const isWindows = process.platform === 'win32';
      const cmd = isWindows ? 'gswin64c' : 'gs';

      // gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=merged.pdf input1.pdf input2.pdf ...
      await runCommand([
        cmd,
        '-dBATCH',
        '-dNOPAUSE',
        '-q',
        '-sDEVICE=pdfwrite',
        `-sOutputFile=${outputPath}`,
        ...inputPaths
      ]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'pdf_merge' });
      metrics.increment('tool_usage_total', { tool: 'pdf_merge' });

      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'pdf_merge' });
      deleteJobDir(path);
      throw e;
    }
  }
};
