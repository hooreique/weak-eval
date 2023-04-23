import { join } from 'node:path';
import compile from './compile.js';
import getView from './getView.js';
import render from './render.js';
import { clearTimer, setTimer } from './timer.js';
import { channels } from './domain/channel.js';
import { peek } from './util/pure.js';

export const initChannels = () => channels;

export const main = (dir, timeLimit = 10_000) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    const subject = {
        className,
        classPath: outDirPath,
    };

    return compile({ outDirPath, codeFilePath })
        .then(() => getView(subject, testsDirPath))
        .then(peek(() => { setTimer(timeLimit) }))
        .then(view => render(view, {
            className,
            codeFilePath,
            outDirPath,
            testsDirPath,
        }))
        .then(() => clearTimer());
};
