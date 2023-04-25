import { join } from 'node:path';
import compile from './compile.js';
import consumer from './consumer.js';
import producer from './producer.js';
import { clearTimer, timerSetter } from './timer.js';
import { passer } from './util/pure.js';

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
