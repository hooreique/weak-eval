import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'
import { broadcast, clear } from './util/channel.js';
import peek from './util/peek.js';
import repeat from './util/repeat.js';

const complete = () => {
    clear('TIMEOUT');
    broadcast('COMPLETE')();
};

export default (subject, testsDirPath) => {
    const createView = (pathPairQueue, maxCapacity = 8) => {
        const capacity = Math.min(maxCapacity, pathPairQueue.size());
        let cnt = 0;

        const view = new Map();

        const pollAndSet = () => {
            if (pathPairQueue.isEmpty()) {
                if (++cnt === capacity) complete();
            } else {
                const [testId, pathPair] = pathPairQueue.poll();
                view.set(testId, evaluate(subject, pathPair)
                    .then(peek(pollAndSet))
                    .catch(err => null));
            }
        };

        repeat(pollAndSet)(capacity);

        return view;
    };

    return readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames))
        .then(pathPairQueue => createView(pathPairQueue));
};
