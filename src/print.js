import { getMessage, result } from './domain/result.js';

export default async (view, meta) => {
    console.log(`frame #${++meta.counter}`);

    const results = [];

    for (const [testId, resultPromise] of view) {
        results.push([testId, getMessage(await Promise
            .race([resultPromise, result.PENDING]))]);
    }

    console.log(results);
};
