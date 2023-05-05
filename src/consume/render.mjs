import { result } from '../domain/result.mjs';
import print from './print.mjs';

const PENDING_RESULT = { value: result.PENDING, time: NaN };

export default async (view, formattedInfo) => {
    const results = [];

    for (const [keyId, resultPromise] of view) {
        results.push([
            keyId,
            await Promise.race([resultPromise, PENDING_RESULT]),
        ]);
    }

    print(results, formattedInfo);
};
