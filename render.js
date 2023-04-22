import print from './print.js';

const render = (view, info, interval = 100, timeLimit = 15_000) => {

    const meta = {
        DONE: {}, // 임의의 상수
        counter: 0,
        completed: false,
        timeoutId: undefined,
        intervalId: undefined,
    };

    return new Promise((resolve, reject) => {
        meta.intervalId = setInterval(() => {
            if (meta.completed) {
                if (meta.timeoutId) clearTimeout(meta.timeoutId);
                if (meta.intervalId) clearInterval(meta.intervalId);
                resolve();
            } else {
                console.clear();
                console.log(info);
                print(view, meta);
            }
        }, interval);

        meta.timeoutId = setTimeout(() => {
            if (meta.completed) {
                if (meta.intervalId) clearInterval(meta.intervalId);
                resolve();
            } else {
                if (meta.intervalId) clearInterval(meta.intervalId);
                reject('채점이 너무 오래 걸립니다.');
            }
        }, timeLimit);
    });
};

export default render;
