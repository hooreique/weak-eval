import { join } from 'node:path';
import compile from './compile.js';
import getView from './getView.js';
import render from './render.js';
import { clearTimer, setTimer } from './timer.js';
import peek from './util/peek.js';

export default (dir, timeLimit = 60_000) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    return compile({ outDirPath, codeFilePath })
        .then(() => getView(testsDirPath, { classPath: outDirPath, className }))
        .then(peek(() => { setTimer(timeLimit) }))
        .then(view => render(view, {
            className,
            codeFilePath,
            outDirPath,
            testsDirPath,
        }))
        .then(() => clearTimer());
};
