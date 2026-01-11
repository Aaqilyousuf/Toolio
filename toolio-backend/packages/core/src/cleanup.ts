import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { deleteJobDir } from './tempDir';
import { tmpdir } from 'os';

const BASE_TMP_DIR = resolve(join(tmpdir(), 'toolio'));
const MAX_AGE_MS = 30 * 60 * 1000; // 30 mins

export function startCleanupInterval(intervalMs: number = 10 * 60 * 1000) {
  // Run immediately on start
  cleanupOldJobs();
  
  // Schedule
  setInterval(cleanupOldJobs, intervalMs);
}

export async function cleanupOldJobs() {
  const now = Date.now();
  console.log('[Cleanup] Starting cleanup of old jobs...');
  
  try {
    const services = await readdir(BASE_TMP_DIR);
    
    for (const service of services) {
      if (service.startsWith('.')) continue; // skip hidden
      const servicePath = join(BASE_TMP_DIR, service);
      
      try {
        const jobs = await readdir(servicePath);
        for (const job of jobs) {
           if (job.startsWith('.')) continue;
           const jobPath = join(servicePath, job);
           
           try {
             const stats = await stat(jobPath);
             // If modified more than 30 mins ago
             if (now - stats.mtimeMs > MAX_AGE_MS) {
               console.log(`[Cleanup] Deleting expired job: ${jobPath}`);
               await deleteJobDir(jobPath);
             }
           } catch (e) {
             console.error(`[Cleanup] Error stating job ${jobPath}:`, e);
           }
        }
      } catch (e) {
        // service dir might act weird or not exist if racing
      }
    }
  } catch (error) {
    if ((error as any).code !== 'ENOENT') {
      console.error('[Cleanup] Error reading base dir:', error);
    }
  }
}
