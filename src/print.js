import { results } from './domain/result.js';

const DUMMY_RESULT = {}; // 임의의 상수

export default async (view, meta) => {
    console.log(`frame #${++meta.counter}`);

    const currentView = [];

    for (let [testId, resultPromise] of view) {
        const result = await Promise.race([resultPromise, DUMMY_RESULT]);

        currentView.push([testId, result === DUMMY_RESULT ? '채점 중...' :
            results[result] ? result.message : '알 수 없음']);
    }

    console.log(currentView);
};
