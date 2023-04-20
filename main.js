import { join } from 'node:path';
import getView from './getView.js';
import simpleCmdSpawn from './simpleCmdSpawn.js';

const WAITING = {};
let cnt = 0;
const write = async (view, status) => {
    console.clear();
    console.log(`frame #${++cnt}`);

    const current = [];

    for (let [key, promise] of view) {
        const value = await Promise.race([promise, WAITING]);
        current.push([key, value === WAITING ?
            '채점 중...' :
            value === undefined ?
                '시간 초과' :
                value ?
                    '정답입니다.' : '틀렸습니다.']);
    }

    console.log(current);
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
