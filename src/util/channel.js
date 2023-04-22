
const channel = new Map();

export const emit = id => data => {
    console.log(id, 'emitted.');
    channel.get(id)?.forEach(on => {
        on(data);
    });
};

export const listen = id => on => {
    const existing = channel.get(id);
    channel.set(id, existing ? [...existing, on] : [on]);
};

export const destroy = id => {
    channel.set(id, []);
};
