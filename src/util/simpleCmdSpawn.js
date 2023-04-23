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
    const childProcess = spawn('cmd.exe', [
        '/c',
        command,
        ...args,
    ]);

    childProcess.stdout.on('data', data => console.log(data.toString()));
    childProcess.stderr.on('data', data => console.error(data.toString()));

    return new Promise((resolve, reject) => {
        childProcess.on('error', err => {
            closeStdio(childProcess, 'on error');
            reject(err);
        });

        let timeoutId;

        childProcess.on('spawn', () => {
            timeoutId = setTimeout(() => {
                closeStdio(childProcess, 'on timeout');
                childProcess.kill();
                reject('timeout');
            }, timeLimit);
        });

        childProcess.on('exit', (code, signal) => {
            closeStdio(childProcess, 'on exit');
            if (timeoutId) clearTimeout(timeoutId);
            if (code === 0) resolve();
            else if (code !== null) reject(`exit code: ${code}`);
            else reject(`signal: ${signal}`);
        });
    });
};
