import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { newAnswer } from './util/answer.mjs';

export default ({ classPath, className, timeLimit }, inKey) =>
    () => {
        const run = spawn(
            'java',
            ['-Dfile.encoding=UTF-8', '-cp', classPath, className],
            { timeout: timeLimit }
        );

        run?.on('error', err => run?.kill());
        run?.stdin?.on('error', err => run?.kill());
        run?.stdout?.on('error', err => run?.kill());
        run?.stderr?.on('error', err => run?.kill());

        once(run, 'exit').then(([code, signal]) => {
            run?.stdin?.end();
            run?.stdout?.end();
            run?.stderr?.end();
        });

        const answer = newAnswer();
        run?.stdout?.on('data', data => answer.push(data));

        run?.stdin?.write(readFileSync(inKey));
        run?.stdin?.end();

        return once(run, 'close').then(([code, signal]) => ({
            answer,
            code,
            signal,
        }));
    };
