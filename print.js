
const print = async (view, meta) => {
    console.log(`frame #${++meta.counter}`);

    const currentView = [];

    let waiting = false;

    for (let [testId, promise] of view) {
        const value = await Promise.race([promise, meta.DONE]);

        if (value === meta.DONE) waiting = true;

        currentView.push([testId, value === meta.DONE ?
            '채점 중...' :
            value.result === null ?
                '시간 초과' :
                value.result ?
                    '정답입니다.' : '틀렸습니다.']);
    }

    meta.completed = !waiting;

    console.log(currentView);
};

export default print;
