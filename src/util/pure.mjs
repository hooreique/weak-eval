export const passer =
    (callback, ...args) =>
    value => {
        callback(...args);
        return value;
    };

export const pipe =
    arg =>
    (...fs) =>
        fs.reduce((v, f) => f(v), arg);

export const repeater =
    n =>
    (callback, ...args) => {
        for (let i = n; i > 0; --i) callback(...args);
    };
