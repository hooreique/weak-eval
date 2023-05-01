export const passer =
    (callback, ...args) =>
    value => {
        callback(...args);
        return value;
    };

export const pipe =
    (...fs) =>
    arg =>
        fs.reduce((v, f) => f(v), arg);

export const repeatWithInterval =
    (n, interval) =>
    (callback, ...args) => {
        if (n <= 0) return;

        callback(...args);

        if (n > 1)
            setTimeout(() => {
                repeatWithInterval(n - 1, interval)(callback, ...args);
            }, interval);
    };
