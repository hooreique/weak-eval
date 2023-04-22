
const DONE = {};

export default async (view, meta) => {
    console.log(`frame #${++meta.counter}`);

    const currentView = [];

    for (let [testId, promise] of view) {
        const value = await Promise.race([promise, DONE]);

        currentView.push([testId, value === DONE ?
            '채점 중...' :
            value.result === null ?
                '시간 초과' :
                value.result ?
                    '정답입니다.' : '틀렸습니다.']);
    }

    console.log(currentView);
};
