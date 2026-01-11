import { createJobDir, runCommand, deleteJobDir, metrics } from '@toolio/core';
import { join } from 'path';

export const VideoService = {
  async trim(file: Blob, startStr: string, endStr: string): Promise<string> {
    const { jobId, path } = await createJobDir('video-service');
    const inputPath = join(path, 'input.mp4');
    const outputPath = join(path, 'output.mp4');

    try {
      await Bun.write(inputPath, file);
      
      const start = Date.now();
      // ffmpeg -ss {start} -to {end} -i input.mp4 -c copy output.mp4
      // Note: order matters for fast seek. -ss before -i
      await runCommand([
          'ffmpeg',
          '-ss', startStr,
          '-to', endStr,
          '-i', inputPath,
          '-c', 'copy',
          outputPath
      ]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'video_trim' });
      metrics.increment('tool_usage_total', { tool: 'video_trim' });

      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'video_trim' });
      deleteJobDir(path);
      throw e;
    }
  },

  async toAudio(file: Blob, bitrate: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    const { jobId, path } = await createJobDir('video-service');
    const inputPath = join(path, 'input.mp4');
    const outputPath = join(path, 'output.mp3');
    
    const bitrates = {
        low: '96k',
        medium: '128k',
        high: '192k'
    };

    try {
      await Bun.write(inputPath, file);
      
      const start = Date.now();
      await runCommand([
          'ffmpeg',
          '-i', inputPath,
          '-vn',
          '-ab', bitrates[bitrate],
          outputPath
      ]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'video_to_audio' });
      metrics.increment('tool_usage_total', { tool: 'video_to_audio' });

      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'video_to_audio' });
      deleteJobDir(path);
      throw e;
    }
  },

  async convertAudio(file: Blob, format: string): Promise<string> {
    const { jobId, path } = await createJobDir('video-service');
    // Save as generic 'input' to avoid path issues
    const inputPath = join(path, 'input'); 
    const outputPath = join(path, `output.${format}`);

    try {
      await Bun.write(inputPath, file);
      
      const start = Date.now();
      await runCommand([
          'ffmpeg',
          '-i', inputPath,
          '-y', // overwrite
          outputPath
      ]);
      metrics.observe('tool_processing_duration_seconds', (Date.now() - start) / 1000, { tool: 'audio_convert' });
      metrics.increment('tool_usage_total', { tool: 'audio_convert' });

      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'audio_convert' });
      deleteJobDir(path);
      throw e;
    }
  }
};
