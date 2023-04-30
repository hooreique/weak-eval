import { readFileSync } from 'node:fs';
import { result } from '../../domain/result.mjs';

export default outKey =>
    ({ answer, code, signal }) =>
        signal === 'SIGTERM'
            ? result.TIMEOUT
            : code === 1
            ? result.ERROR
            : code === 0
            ? answer.equals(readFileSync(outKey))
                ? result.CORRECT
                : result.INCORRECT
            : result.UNKNOWN;
