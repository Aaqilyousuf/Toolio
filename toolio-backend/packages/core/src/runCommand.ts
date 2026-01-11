import { spawn } from 'bun';

export async function runCommand(cmd: string[], timeoutMs: number = 30000): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let timedOut = false;
    
    const proc = spawn(cmd, {
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      proc.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${cmd.join(' ')}`));
    }, timeoutMs);

    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text()
    ]);

    const exitCode = await proc.exited;
    clearTimeout(timeout);

    if (timedOut) return; // Promise already rejected

    if (exitCode !== 0) {
      reject(new Error(`Command exited with ${exitCode}: ${stderr}`));
    } else {
      resolve(stdout);
    }
  });
}
