import { join, resolve, normalize } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, rm } from 'fs/promises';
import { tmpdir } from 'os';

const BASE_TMP_DIR = resolve(join(tmpdir(), 'toolio'));

export async function createJobDir(serviceName: string) {
  const jobId = uuidv4();
  const jobPath = join(BASE_TMP_DIR, serviceName, jobId);
  
  await mkdir(jobPath, { recursive: true });
  
  return {
    jobId,
    path: jobPath
  };
}

export async function deleteJobDir(path: string) {
  try {
    const resolvedPath = resolve(path);
    // Basic safety check: ensure we are deleting inside /tmp/toolio (normalized)
    if (!resolvedPath.startsWith(BASE_TMP_DIR)) {
      console.error(`Attempted to delete unsafe path: ${resolvedPath}. Expected to start with: ${BASE_TMP_DIR}`);
      return;
    }
    await rm(resolvedPath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Failed to delete job dir ${path}:`, error);
  }
}
