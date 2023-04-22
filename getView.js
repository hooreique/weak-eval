import { open, readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'

const createView = (fileHandlePromisePairQueue, { classPath, className }) => {
    const view = new Map();

    while (!fileHandlePromisePairQueue.isEmpty()) {
        const [testId, fileHandlePromisePair] = fileHandlePromisePairQueue.poll();
        view.set(testId, evaluate(testId, fileHandlePromisePair, { classPath, className })
            .catch(err => ({ testId, result: null })));
    }

    return view;
};

const getView = (testsDirPath, { classPath, className }) =>
    readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames)
            .pipe(pathPair => pathPair.map(path => open(path))))
        .then(fileHandlePromisePairQueue =>
            createView(fileHandlePromisePairQueue, { classPath, className }));

export default getView;
