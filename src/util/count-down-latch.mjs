
export default initCount => callback => {
    let count = initCount;
    return {
        countDown: (...args) => {
            if (--count === 0) callback(...args);
        },
    };
};
