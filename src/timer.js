import { channel } from './domain/channel.js';
import { clear, publish } from './util/subscription.js';

let timeoutId;

const publishTimeoutEvent = () => {
    clear(channel.COMPLETE);
    publish(channel.TIMEOUT);
};

export const timerSetter = timeLimit => () => {
    timeoutId = setTimeout(publishTimeoutEvent, timeLimit);
};

export const clearTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
};
