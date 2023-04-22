import { open, readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'
import { listen, emit } from './util/channel.js';
import peek from './util/peek.js';
import repeat from './util/repeat.js';

const createView = (fileHandlePromisePairQueue, { classPath, className }, initCapacity = 8) => {
    const view = new Map();

    listen('eval')(() => {
        if (!fileHandlePromisePairQueue.isEmpty()) {
            const [testId, fileHandlePromisePair] = fileHandlePromisePairQueue.poll();
            view.set(testId, evaluate(testId, fileHandlePromisePair, { classPath, className })
                .then(peek(emit('eval'))));
        }
    });

    repeat(emit('eval'))(initCapacity);

    return view;
};

const getView = (testsDirPath, { classPath, className }) =>
    readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames)
            .pipe(pathPair => pathPair.map(path => open(path))))
        .then(fileHandlePromisePairQueue =>
            createView(fileHandlePromisePairQueue, { classPath, className }));

export default getView;
