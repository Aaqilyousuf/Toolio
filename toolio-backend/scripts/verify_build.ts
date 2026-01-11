import { spawn } from 'bun';

const services = [
    { name: 'image-service', path: 'apps/image-service/src/index.ts', port: 4001 },
    { name: 'pdf-service', path: 'apps/pdf-service/src/index.ts', port: 4002 },
    { name: 'video-service', path: 'apps/video-service/src/index.ts', port: 4003 },
];

async function verify() {
    console.log('Starting verification...');
    let success = true;

    for (const service of services) {
        console.log(`Verifying ${service.name}...`);
        
        const proc = spawn(['bun', service.path], {
            stdout: 'pipe',
            stderr: 'pipe',
        });

        // specific check: wait for "starting on port" log or just wait 3s and check exit code
        const start = Date.now();
        let started = false;

        // active wait
        const reader = proc.stdout.getReader();
        
        // Race: timeout vs log detection
        const checkPromise = new Promise<void>(async (resolve, reject) => {
             // quick read loop
             try {
                // If we don't get data in 5s, fail
                setTimeout(() => reject('Timeout waiting for stdout'), 5000);

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const text = new TextDecoder().decode(value);
                    if (text.includes(`starting on port ${service.port}`)) {
                        console.log(`✅ ${service.name} started successfully.`);
                        started = true;
                         resolve();
                        break;
                    }
                }
             } catch (e) {
                 reject(e);
             }
        });

        try {
            await checkPromise;
        } catch (e) {
            console.error(`❌ ${service.name} failed to start:`, e);
            success = false;
        } finally {
            proc.kill();
        }
    }

    if (success) {
        console.log('All services verified!');
    } else {
        console.error('Verification failed.');
        process.exit(1);
    }
}

verify();
