import { join } from 'node:path';
import getView from './getView.js';
import simpleCmdSpawn from './simpleCmdSpawn.js';

let cnt = 0;
const write = (view, status) => {
    console.clear();
    console.log('frame #' + ++cnt);
    console.log(view);
};

const refreshEveryMs = (view, interval = 100) => new Promise((resolve, reject) => {
    const status = { done: false };

    const intervalId = setInterval(() => {
        if (status.done) {
            clearInterval(intervalId);
            resolve();
        } else {
            write(view, status);
        }
    }, interval);

    setTimeout(() => {
        if (status.done) {
            clearInterval(intervalId);
            resolve();
        } else {
            clearInterval(intervalId);
            reject('이제 그만');
        }
    }, 6_000);
});

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
        .then(view => refreshEveryMs(view));
};

export default main;
