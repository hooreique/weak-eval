import { initChannels } from '../main.js';

let channels;
let counter = 0;
const chennalToListeners = new Map();
const subscriptionIdToChannel = new Map();

const getChannels = () => channels ||= initChannels();

const assertExisting = channel => {
    if (!getChannels()[channel]) throw new Error('Channel not found');
};

export const publish = channel => event => {
    assertExisting(channel);
    console.log(channel.message);
    chennalToListeners.get(channel)
        ?.forEach(callback => {
            callback(event);
        });
};

export const subscribe = channel => callback => {
    assertExisting(channel);
    const subscriptionId = ++counter;
    let listeners;
    chennalToListeners.set(channel, (listeners =
        chennalToListeners.get(channel) || new Map()));
    listeners.set(subscriptionId, callback);
    subscriptionIdToChannel.set(subscriptionId, channel);
    return subscriptionId;
};

export const unsubscribe = subscriptionId => {
    const channel = subscriptionIdToChannel.get(subscriptionId);
    if (!channel) return false;
    const listeners = chennalToListeners.get(channel);
    if (!listeners) return false;
    return listeners.delete(subscriptionId);
};

export const clear = channel => {
    assertExisting(channel);
    chennalToListeners.get(channel)?.clear();
};
