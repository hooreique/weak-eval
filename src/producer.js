import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import keyTreeFactory from './keyTreeFactory.js';
import toKeyPairQueue from './keyTransformer.js'
import { channel } from './domain/channel.js';
import { countDownLatch, passer, repeater } from './util/pure.js';
import { clear, publish } from './util/subscription.js';

const publishCompleteEvent = () => {
    clear(channel.TIMEOUT);
    publish(channel.COMPLETE);
};

export default (subject, keyDirPath) => () => {
    const viewFactory = (maxCapacity = 8) => keyPairQueue => {
        const view = new Map();

        const capacity = Math.min(maxCapacity, keyPairQueue.size());

        const counter = countDownLatch(capacity)(publishCompleteEvent);

        const pollAndSet = () => {
            if (keyPairQueue.isEmpty()) {
                counter.countDown();
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
