import { channel } from './domain/channel.mjs';
import { clear, publish } from './util/pub-sub.mjs';

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
