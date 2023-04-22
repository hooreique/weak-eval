import { open, readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'
import { destroy, emit } from './util/channel.js';
import peek from './util/peek.js';
import repeat from './util/repeat.js';

const complete = () => {
    destroy('TIMEOUT');
    emit('COMPLETE')();
};

const createView = (target, fileHandlePromisePairQueue, maxCapacity = 8) => {
    const capacity = Math.min(maxCapacity, fileHandlePromisePairQueue.size());
    let cnt = 0;

    const view = new Map();

    const pollAndSet = () => {
        if (fileHandlePromisePairQueue.isEmpty()) {
            if (++cnt === capacity) complete();
        } else {
            const [testId, fileHandlePromisePair] = fileHandlePromisePairQueue.poll();
            view.set(testId, evaluate(target, fileHandlePromisePair)
                .then(peek(pollAndSet))
                .catch(err => null));
        }
    };

    repeat(pollAndSet)(capacity);

    return view;
};

export default (target, testsDirPath) =>
    readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames)
            .pipe(pathPair => pathPair.map(path => open(path))))
        .then(fileHandlePromisePairQueue =>
            createView(target, fileHandlePromisePairQueue));
