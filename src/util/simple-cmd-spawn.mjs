import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { stdout, stderr } from 'node:process';
import { throwNewError } from './error.mjs';

export default (command, args, timeLimit = 5000) => {
    const subProcess = spawn('cmd.exe', ['/c', command, ...args]);

    subProcess.stdout.pipe(stdout);
    subProcess.stderr.pipe(stderr);

    let timeoutId;

    once(subProcess, 'spawn').then(() => {
        timeoutId = setTimeout(() => {
            subProcess.kill();
        }, timeLimit);
    });

    return once(subProcess, 'close').then(([code, signal]) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (code !== 0) throwNewError({ code, signal });
    });
};
