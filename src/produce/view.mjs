import { getConfig } from '../config.mjs';
import { newCountDownLatch } from '../util/count-down-latch.mjs';
import { throwNewError } from '../util/error.mjs';
import { passer, repeatWithInterval } from '../util/pure.mjs';
import { publish } from '../util/single-pub-sub.mjs';
import evaluate from './evaluate.mjs';

export default keyPairQueue => {
    const { maxCapacity } = getConfig().producingOption;
    const { timeLimit } = getConfig().producingOption.runOption;

    const view = new Map();

    const capacity = Math.min(maxCapacity, keyPairQueue.size());

    if (capacity === 0)
        throwNewError('Zero Capacity; Check the max-capacity or the keys.');

    const countDownLatch = newCountDownLatch(capacity)(publish);

    const pollAndSet = () => {
        if (keyPairQueue.isEmpty()) {
            countDownLatch.countDown();
            return;
        }

        const [keyId, keyPair] = keyPairQueue.poll();
        view.set(keyId, evaluate(keyPair).then(passer(pollAndSet)));
    };

    repeatWithInterval(capacity, timeLimit / capacity)(pollAndSet);

    return view;
};
