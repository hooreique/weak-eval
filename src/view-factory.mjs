import evaluate from './evaluate.mjs';
import { channel } from './domain/channel.mjs';
import newCountDownLatch from './util/count-down-latch.mjs';
import { passer, repeater } from './util/pure.mjs';
import { clear, publish } from './util/pub-sub.mjs';

const publishCompleteEvent = () => {
    clear(channel.TIMEOUT);
    publish(channel.COMPLETE);
};

export default (subject, maxCapacity = 8) => keyPairQueue => {
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
