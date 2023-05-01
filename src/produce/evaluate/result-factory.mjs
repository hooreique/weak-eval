import { readFileSync } from 'node:fs';
import { result } from '../../domain/result.mjs';
import { prune } from '../../util/string.mjs';

const withNaN = value => ({ value, time: NaN });
const withTime = (value, time) => ({ value, time });

export default ({ timeLimit }, outKey) =>
    ({ code, signal, answer }) => {
        if (code !== 0 && code !== 1 && signal !== 'SIGTERM')
            return result.UNKNOWN;

        if (signal === 'SIGTERM') return withNaN(result.TIMEOUT);

        if (code === 1) return withNaN(result.ERROR);

        const prunedAnswer = prune(answer);

        const leftMarker = prunedAnswer.lastIndexOf('^');
        const rightMarker = prunedAnswer.lastIndexOf('$');

        const duration = parseInt(
            prunedAnswer.substring(leftMarker + 1, rightMarker)
        );

        if (!(duration <= timeLimit)) return withTime(result.TIMEOUT, duration);

        const prunedKey = prune(readFileSync(outKey));

        const pureAnswer = prunedAnswer.substring(0, leftMarker - 1);

        return pureAnswer === prunedKey
            ? withTime(result.CORRECT, duration)
            : withTime(result.INCORRECT, duration);
    };
