
let counter = 0;
const channelToListeners = new Map();
const subscriptionIdToChannel = new Map();

export const publish = (channel, event) => {
    console.log('An event "',
        event || 'Default',
        '" has emitted on channel "',
        channel?.name || channel,
        '"');
    channelToListeners.get(channel)
        ?.forEach(callback => {
            callback(event);
        });
};

export const subscribe = (channel, callback) => {
    const subscriptionId = ++counter;
    let listeners;
    channelToListeners.set(channel, (listeners =
        channelToListeners.get(channel) || new Map()));
    listeners.set(subscriptionId, callback);
    subscriptionIdToChannel.set(subscriptionId, channel);
    return subscriptionId;
};

export const unsubscribe = subscriptionId => {
    const channel = subscriptionIdToChannel.get(subscriptionId);
    if (!channel) return false;
    const listeners = channelToListeners.get(channel);
    if (!listeners) return false;
    const deleted = listeners.delete(subscriptionId);
    if (deleted) subscriptionIdToChannel.delete(subscriptionId);
    return deleted;
};

export const clear = channel => {
    channelToListeners.get(channel)?.clear();
};
