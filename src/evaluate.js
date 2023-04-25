import comparator from './comparator.js';
import run from './run.js';
import { channel } from './domain/channel.js';
import { result } from './domain/result.js';
import { subscribe, unsubscribe } from './util/pub-sub.js';

/**
 * @return Promise fulfilled with result.
 * CORRECT if the answer is correct,
 * INCORRECT if the answer is incorrect,
 * TIMEOVER if time is over.
 * TIMEOUT if application timer rings.
 * ERROR if run time error occurs.
 */
export default (subject, [inKey, outKey], timeLimit = 2_000) => {
    /* TO-BE
    return run(subject, inKey, timeLimit)
        .then(comparator(outKey))
        .catch(() => result.UNKNOWN);
    */

    // /* AS-IS
    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    return new Promise((resolve, reject) => {
        let timeoutIdIn;
        let timeoutIdOut;
        let subscriptionId;

        timeoutIdIn = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            resolve(Math.random() < 0.5 ? result.CORRECT : result.INCORRECT);
        }, getRandomArbitrary(300, 900));

        timeoutIdOut = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            resolve(result.TIMEOVER);
        }, 700);

        subscriptionId = subscribe(channel.TIMEOUT, () => {
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            reject(result.TIMEOUT);
        });
    });
    // */
};
