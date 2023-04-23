import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import pathPairQueueFactory from './pathPairQueueFactory.js'
import { channel } from './domain/channel.js';
import { passer, repeater } from './util/pure.js';
import { clear, publish } from './util/subscription.js';

const publishCompleteEvent = () => {
    clear(channel.TIMEOUT);
    publish(channel.COMPLETE);
};

export default (subject, testsDirPath) => () => {
    const resultMapFactory = (maxCapacity = 8) => pathPairQueue => {
        const capacity = Math.min(maxCapacity, pathPairQueue.size());
        let cnt = 0;

        const view = new Map();

        const pollAndSet = () => {
            if (pathPairQueue.isEmpty()) {
                if (++cnt === capacity) publishCompleteEvent();
                return;
            }

            const [testId, pathPair] = pathPairQueue.poll();
            view.set(testId, evaluate(subject, pathPair)
                .then(passer(pollAndSet)())
                .catch(result => result));
        };

        repeater(capacity)(pollAndSet)();

        return view;
    };

    return readdir(testsDirPath)
        .then(pathPairQueueFactory(testsDirPath))
        .then(resultMapFactory());
};
