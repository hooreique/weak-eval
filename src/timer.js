import { destroy, emit } from './util/channel.js';

const timer = {};

export const setTimer = timeLimit => {
    timer.timeoutId = setTimeout(() => {
        destroy('COMPLETE');
        emit('TIMEOUT')();
    }, timeLimit);
};

export const clearTimer = () => {
    if (timer.timeoutId) clearTimeout(timer.timeoutId);
};
