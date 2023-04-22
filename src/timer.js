import { destroy, emit } from './util/channel.js';

const timer = {};

const timeout = () => {
    destroy('COMPLETE');
    emit('TIMEOUT')();
};

export const setTimer = timeLimit => {
    timer.timeoutId = setTimeout(timeout, timeLimit);
};

export const clearTimer = () => {
    if (timer.timeoutId) clearTimeout(timer.timeoutId);
};
