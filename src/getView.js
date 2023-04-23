import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import getPathPairQueue from './getPathPairQueue.js'
import { channel } from './domain/channel.js';
import { clear, publish } from './util/subscription.js';
import peek from './util/peek.js';
import repeat from './util/repeat.js';

const onComplete = () => {
    clear(channel.TIMEOUT);
    publish(channel.COMPLETE)();
};

export default (subject, testsDirPath) => {
    const createView = (pathPairQueue, maxCapacity = 8) => {
        const capacity = Math.min(maxCapacity, pathPairQueue.size());
        let cnt = 0;

        const view = new Map();

        const pollAndSet = () => {
            if (pathPairQueue.isEmpty()) {
                if (++cnt === capacity) onComplete();
            } else {
                const [testId, pathPair] = pathPairQueue.poll();
                view.set(testId, evaluate(subject, pathPair)
                    .then(peek(pollAndSet))
                    .catch(result => result));
            }
        };

        repeat(pollAndSet)(capacity);

        return view;
    };

    return readdir(testsDirPath)
        .then(basenames => getPathPairQueue(testsDirPath, basenames))
        .then(pathPairQueue => createView(pathPairQueue));
};
