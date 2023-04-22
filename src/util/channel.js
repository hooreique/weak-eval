
const channel = {
    typeToSubscription: new Map(),
    idToType: new Map(),
    seq: 0,
};

export const broadcast = type => data => {
    console.log(type);
    channel.typeToSubscription.get(type)?.forEach(callback => {
        callback(data);
    });
};

export const subscribe = type => callback => {
    const id = ++channel.seq;
    let subscription;
    channel.typeToSubscription.set(type,
        (subscription = channel.typeToSubscription.get(type) || new Map()));
    subscription.set(id, callback);
    channel.idToType.set(id, type);
    return id;
};

export const unsubscribe = id => {
    const type = channel.idToType.get(id);
    if (!type) return;
    const subscription = channel.typeToSubscription.get(type);
    if (!subscription) return;
    return subscription.delete(id);
};

export const clear = type => {
    channel.typeToSubscription.get(type)?.clear();
};
