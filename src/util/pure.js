
export const passer = (callback, ...args) => value => {
    callback(...args);
    return value;
};

export const pipe = (...args) => (...functions) => {
    if (functions.length === 0) return args[0];
    return pipe(functions.shift()(...args))(...functions);
};

export const repeater = n => (callback, ...args) => {
    for (let i = n; i > 0; --i) callback(...args);
};
