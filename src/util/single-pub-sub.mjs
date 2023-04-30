const subscription = new Set();

export const publish = event => {
    subscription.forEach(callback => callback(event));
};

export const subscribe = callback => {
    subscription.add(callback);
};
