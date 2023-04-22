
const channel = new Map();

export const emit = id => data => {
    channel.get(id)?.(data);
};

export const listen = id => on => {
    channel.set(id, on);
};
