import { broadcast, clear } from './util/channel.js';

const timer = {};

const timeout = () => {
    clear('COMPLETE');
    broadcast('TIMEOUT')();
};

export const setTimer = timeLimit => {
    timer.timeoutId = setTimeout(timeout, timeLimit);
};

export const clearTimer = () => {
    if (timer.timeoutId) clearTimeout(timer.timeoutId);
};
