import { join } from 'node:path';
import compile from './compile.mjs';
import consumer from './consumer.mjs';
import producer from './producer.mjs';
import { clearTimer, timerSetter } from './timer.mjs';
import { passer } from './util/pure.mjs';

export default (dir, timeLimit = 10_000) => {
    const className = 'Main';
    const classPath = join(dir, 'out');
    const keyDirPath = join(dir, 'tests');
    const codeFilePath = join(dir, 'solutions', className + '.java');

    const subject = {
        className,
        classPath,
    };

    return compile({ classPath, codeFilePath })
        .then(producer(subject, keyDirPath))
        .then(passer(timerSetter(timeLimit)))
        .then(consumer({
            className,
            classPath,
            keyDirPath,
            codeFilePath,
        }))
        .then(clearTimer);
};
