import { readFileSync } from 'node:fs';
import { result } from '../../domain/result.mjs';
import { prune } from '../../util/string.mjs';

export default ({ timeLimit }, outKey) =>
    ({ code, signal, answer }) => {
        if (code !== 0 && code !== 1 && signal !== 'SIGTERM')
            return result.UNKNOWN;

        if (signal === 'SIGTERM') return result.TIMEOUT;

        if (code === 1) return result.ERROR;

        const prunedAnswer = prune(answer);

        const leftMarker = prunedAnswer.lastIndexOf('^');
        const rightMarker = prunedAnswer.lastIndexOf('$');

        const duration = parseInt(
            prunedAnswer.substring(leftMarker + 1, rightMarker)
        );

        if (!(duration <= timeLimit)) return result.TIMEOUT;

        const prunedKey = prune(readFileSync(outKey));

        const pureAnswer = prunedAnswer.substring(0, leftMarker - 1);

        return pureAnswer === prunedKey ? result.CORRECT : result.INCORRECT;
    };
