import { clear, log } from 'node:console';
import { result } from '../domain/result.mjs';

const BLANK = Symbol('');

const colorFormat = new Map();

//                                          Pending => Yellow
colorFormat.set(result.PENDING, '\x1b[97m%s\x1b[90m => \x1b[93m%s\t');
//                                          Correct => Green
colorFormat.set(result.CORRECT, '\x1b[97m%s\x1b[90m => \x1b[92m%s\t');
//                                          Incorrect => Red
colorFormat.set(result.INCORRECT, '\x1b[97m%s\x1b[90m => \x1b[91m%s\t');
//                                          Timeout => Purple
colorFormat.set(result.TIMEOUT, '\x1b[97m%s\x1b[90m => \x1b[95m%s\t');
//                                          Error => Blue
colorFormat.set(result.ERROR, '\x1b[97m%s\x1b[90m => \x1b[94m%s\t');
//                                          Unknown => Cyan
colorFormat.set(result.UNKNOWN, '\x1b[97m%s\x1b[90m => \x1b[96m%s\t');

const formatAndArgs = ([keyId, result]) => [
    colorFormat.get(result),
    [keyId, result.message],
];

const yieldFormatAndArgs = function* (results, columnCount) {
    const len = results.length;
    for (let i = 0; i < len; ) {
        for (let j = columnCount; j > 0 && i < len; --j, ++i)
            yield formatAndArgs(results[i]);
        yield ['\n', BLANK];
    }
};

let frameCount = 0;

export default (results, formattedInfo, columnCount = 4) => {
    const formats = [];
    const argss = [];

    for (const [format, args] of yieldFormatAndArgs(results, columnCount)) {
        formats.push(format);
        argss.push(args);
    }
    formats.push('\x1b[0m');

    clear();

    log(`Frame #${++frameCount}\n`);

    log(...formattedInfo);

    log(formats.join(''), ...argss.filter(i => i !== BLANK).flat());
};
