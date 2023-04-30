import print from './print.mjs';
import { result } from './domain/result.mjs';

export default async (view, formattedInfo) => {
    const results = [];

    for (const [keyId, resultPromise] of view) {
        results.push([
            keyId,
            await Promise.race([resultPromise, result.PENDING]),
        ]);
    }

    print(results, formattedInfo);
};
