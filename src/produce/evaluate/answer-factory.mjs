import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { getConfig } from '../../config.mjs';
import newAnswerContainer from './answer-container.mjs';

export default inKey => () => {
    const { command, args, timeLimit } = getConfig().producingOption.runOption;

    const input = readFileSync(inKey);

    const answerContainer = newAnswerContainer();

    const run = spawn(command, args, { timeout: timeLimit * 2 });

    run?.on('error', err => run?.kill());
    run?.stdin?.on('error', err => run?.kill());
    run?.stdout?.on('error', err => run?.kill());
    run?.stderr?.on('error', err => run?.kill());

    once(run, 'exit').then(([code, signal]) => {
        run?.stdin?.end();
        run?.stdout?.end();
        run?.stderr?.end();
    });

    run?.stdout?.on('data', buffer => {
        answerContainer.push(buffer);
    });

    run?.stdin?.write(input);
    run?.stdin?.end();

    return once(run, 'close').then(([code, signal]) => ({
        code,
        signal,
        answerContainer,
    }));
};
