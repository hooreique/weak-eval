
export const passer = callback => (...args) => value => {
    callback(...args);
    return value;
};

export const repeater = n => callback => (...args) => {
    for (let i = 0; i < n; ++i) callback(...args);
};
