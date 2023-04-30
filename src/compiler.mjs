import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { stdout, stderr } from 'node:process';
import { throwNewError } from './util/error.mjs';

export default ({ command, args }, timeLimit = 2_000) =>
    () => {
        const compile = spawn(command, args, {
            timeout: timeLimit,
        });

        compile?.stderr?.pipe(stderr);
        compile?.stdout?.pipe(stdout);

        return once(compile, 'close').then(([code, signal]) => {
            if (code !== 0) throwNewError({ code, signal });
        });
    };
