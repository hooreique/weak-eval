import { join } from 'node:path';
import getView from './getView.js';
import render from './render.js';
import simpleCmdSpawn from './util/simpleCmdSpawn.js';

const compile = ({ outDirPath, codeFilePath }) =>
    simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        outDirPath,
        codeFilePath,
    ]);

const main = (dir) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    return compile({ outDirPath, codeFilePath })
        .then(() => getView(testsDirPath, { classPath: outDirPath, className }))
        .then(view => render(view, {
            className,
            codeFilePath,
            outDirPath,
            testsDirPath,
        }));
};

export default main;
