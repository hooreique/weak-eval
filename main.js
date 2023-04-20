import { join } from 'node:path';
import getView from './getView.js';
import render from './render.js';
import simpleCmdSpawn from './simpleCmdSpawn.js';

const main = (dir) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    return simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        outDirPath,
        codeFilePath,
    ])
        .then(() => getView(testsDirPath, { classPath: outDirPath, className }))
        .then(view => render(view));
};

export default main;
