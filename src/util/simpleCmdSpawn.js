import { spawn } from 'node:child_process';

const closeStdio = (process, context) => {
    try {
        process.stdin.end();
        process.stdout.end();
        process.stderr.end();
    } catch (err) {
        console.error(err);
        console.log('Error occurred during closing stdio:', context);
    }
};

export default (command, args, timeLimit = 5000) => {
    const process = spawn('cmd.exe', [
        '/c',
        command,
        ...args,
    ]);

    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.error(data.toString()));

    return new Promise((resolve, reject) => {
        process.on('error', err => {
            closeStdio(process, 'on error');
            reject(err);
        });

        let timeoutId;

        process.on('spawn', () => {
            timeoutId = setTimeout(() => {
                closeStdio(process, 'on timeout');
                process.kill();
                reject('timeout');
            }, timeLimit);
        });

        process.on('exit', (code, signal) => {
            closeStdio(process, 'on exit');
            if (timeoutId) clearTimeout(timeoutId);
            if (code === 0) resolve();
            else if (code !== null) reject(`exit code: ${code}`);
            else reject(`signal: ${signal}`);
        });
    });
};
