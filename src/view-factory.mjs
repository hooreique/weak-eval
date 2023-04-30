import evaluate from './evaluate.mjs';
import { newCountDownLatch } from './util/count-down-latch.mjs';
import { passer, repeater } from './util/pure.mjs';
import { publish } from './util/single-pub-sub.mjs';

export default (runOption, maxCapacity = 8) =>
    keyPairQueue => {
        const view = new Map();

        const capacity = Math.min(maxCapacity, keyPairQueue.size());

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

        repeater(capacity)(pollAndSet);

        return view;
    };
