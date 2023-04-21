import { spawn } from 'node:child_process';

const simpleCmdSpawn = (command, args, timeLimitInMs = 5000) =>
    new Promise((resolve, reject) => {
        const process = spawn('cmd.exe', [
            '/c',
            command,
            ...args,
        ]);

        const closeStdio = context => {
            try {
                process.stdin.end();
                process.stdout.end();
                process.stderr.end();
            } catch (err) {
                console.error(err);
                console.log('Error occurred during closing stdio:', context);
            }
        };

        process.stdout.on('data', data => console.log(data.toString()));
        process.stderr.on('data', data => console.error(data.toString()));
        process.on('error', err => {
            closeStdio('on error');
            reject(err);
        });

        let timeoutId;

        process.on('spawn', () => {
            timeoutId = setTimeout(() => {
                closeStdio('on timeout');
                process.kill();
                reject('timeout');
            }, timeLimitInMs);
        });

        process.on('exit', (code, signal) => {
            closeStdio('on exit');
            if (timeoutId) clearTimeout(timeoutId);
            if (code === 0) resolve();
            else if (code !== null) reject(`exit code: ${code}`);
            else reject(`signal: ${signal}`);
        });
    });

export default simpleCmdSpawn;
