import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import keyTreeFactory from './key-tree-factory.js';
import toKeyPairQueue from './key-transformer.js'
import { channel } from './domain/channel.js';
import newCountDownLatch from './util/count-down-latch.js';
import { passer, repeater } from './util/pure.js';
import { clear, publish } from './util/pub-sub.js';

const publishCompleteEvent = () => {
    clear(channel.TIMEOUT);
    publish(channel.COMPLETE);
};

export default (subject, keyDirPath) => () => {
    const viewFactory = (maxCapacity = 8) => keyPairQueue => {
        const view = new Map();

        const capacity = Math.min(maxCapacity, keyPairQueue.size());

        const countDownLatch = newCountDownLatch(capacity)(publishCompleteEvent);

        const pollAndSet = () => {
            if (keyPairQueue.isEmpty()) {
                countDownLatch.countDown();
                return;
            }

            const [keyId, keyPair] = keyPairQueue.poll();
            view.set(keyId, evaluate(subject, keyPair)
                .then(passer(pollAndSet))
                .catch(result => result));
        };

        repeater(capacity)(pollAndSet);

        return view;
    };

    return readdir(keyDirPath)
        .then(keyTreeFactory(keyDirPath))
        .then(toKeyPairQueue)
        .then(viewFactory());
};
