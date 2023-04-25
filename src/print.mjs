import { getMessage, result } from './domain/result.mjs';

let frameNumber = 0;

export default async view => {
    console.log(`frame #${++frameNumber}`);

    const results = [];

    for (const [keyId, resultPromise] of view) {
        results.push([keyId, getMessage(await Promise
            .race([resultPromise, result.PENDING]))]);
    }

    console.log(results);
};
