
export const peek = callback => value => {
    callback();
    return value;
};

export const repeat = callback => n => {
    for (let i = 0; i < n; ++i) callback();
};
