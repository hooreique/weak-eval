import { readFileSync } from 'node:fs';
import { getConfig } from '../../config.mjs';
import { result } from '../../domain/result.mjs';
import { prune } from '../../util/string.mjs';

const withNaN = value => ({ value, time: NaN });
const withTime = (value, time) => ({ value, time });

export default outKey =>
    ({ code, signal, answerContainer }) => {
        const { timeLimit } = getConfig().producingOption.runOption;

        if (code !== 0 && code !== 1 && signal !== 'SIGTERM')
            return result.UNKNOWN;

        if (signal === 'SIGTERM') return withNaN(result.TIMEOUT);

        if (code === 1) return withNaN(result.ERROR);

        const [answer, duration] = answerContainer.getAnswerAndDuration();

        if (!(duration <= timeLimit)) return withTime(result.TIMEOUT, duration);

        return prune(readFileSync(outKey)) === prune(answer)
            ? withTime(result.CORRECT, duration)
            : withTime(result.INCORRECT, duration);
    };
