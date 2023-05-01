import evaluate from './evaluator.mjs';
import { newCountDownLatch } from '../util/count-down-latch.mjs';
import { throwNewError } from '../util/error.mjs';
import { passer, repeatWithInterval } from '../util/pure.mjs';
import { publish } from '../util/single-pub-sub.mjs';

export default (runOption, maxCapacity = 8) =>
    keyPairQueue => {
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
            view.set(
                keyId,
                evaluate(runOption, keyPair).then(passer(pollAndSet))
            );
        };

        repeatWithInterval(
            capacity,
            runOption.timeLimit / capacity
        )(pollAndSet);

        return view;
    };
