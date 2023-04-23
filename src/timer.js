import { channel } from './domain/channel.js';
import { clear, publish } from './util/subscription.js';

let timeoutId;

const onTimeout = () => {
    clear(channel.COMPLETE);
    publish(channel.TIMEOUT)();
};

export const setTimer = timeLimit => {
    timeoutId = setTimeout(onTimeout, timeLimit);
};

export const clearTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
};
