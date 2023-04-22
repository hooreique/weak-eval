import { open, readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'

const getView = (testsDirPath, { classPath, className }) =>
    readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames)
            .pipe(pathPair => pathPair.map(path => open(path)))
            .toMap(fileHandlePromisePair =>
                evaluate(fileHandlePromisePair, { classPath, className })
                    .catch(err => null)));

export default getView;
