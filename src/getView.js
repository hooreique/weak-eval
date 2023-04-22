import { open, readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'
import { destroy, emit } from './util/channel.js';
import peek from './util/peek.js';
import repeat from './util/repeat.js';

const createView = (fileHandlePromisePairQueue, config, maxCapacity = 8) => {
    const capacity = Math.min(maxCapacity, fileHandlePromisePairQueue.size());
    let cnt = 0;

    const view = new Map();

    const pollAndSet = () => {
        if (fileHandlePromisePairQueue.isEmpty()) {
            if (++cnt === capacity) {
                destroy('TIMEOUT');
                emit('COMPLETE')();
            }
        } else {
            const [testId, fileHandlePromisePair] = fileHandlePromisePairQueue.poll();
            view.set(testId, evaluate(testId, fileHandlePromisePair, config)
                .then(peek(pollAndSet))
                .catch(err => ({ testId, result: null })));
        }
    };

    repeat(pollAndSet)(capacity);

    return view;
};

export default (testsDirPath, config) =>
    readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames)
            .pipe(pathPair => pathPair.map(path => open(path))))
        .then(fileHandlePromisePairQueue =>
            createView(fileHandlePromisePairQueue, config));
