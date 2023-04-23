import { initChannels } from '../main.js';

const channelManager = {
    channelTable: new Map(),
    subscriptionIdToChannel: new Map(),
    counter: 0,
};

let channels;

const getChannels = () => channels ||= initChannels();

const assertExisting = channel => {
    if (!getChannels()[channel]) throw new Error('Channel not found');
};

export const publish = channel => data => {
    assertExisting(channel);
    console.log(channel.message);
    channelManager.channelTable.get(channel)
        ?.forEach(callback => {
            callback(data);
        });
};

export const subscribe = channel => callback => {
    assertExisting(channel);
    const subscriptionId = ++channelManager.counter;
    let subscription;
    channelManager.channelTable.set(channel, (subscription =
        channelManager.channelTable.get(channel) || new Map()));
    subscription.set(subscriptionId, callback);
    channelManager.subscriptionIdToChannel.set(subscriptionId, channel);
    return subscriptionId;
};

export const unsubscribe = subscriptionId => {
    const channel = channelManager.subscriptionIdToChannel.get(subscriptionId);
    if (!channel) return;
    const map = channelManager.channelTable.get(channel);
    if (!map) return;
    return map.delete(subscriptionId);
};

export const clear = channel => {
    assertExisting(channel);
    channelManager.channelTable.get(channel)?.clear();
};
