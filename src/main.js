import { join } from 'node:path';
import compile from './compile.js';
import consumer from './consumer.js';
import producer from './producer.js';
import { clearTimer, timerSetter } from './timer.js';
import { passer } from './util/pure.js';

export default (dir, timeLimit = 10_000) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    const subject = {
        className,
        classPath: outDirPath,
    };

    return compile({ outDirPath, codeFilePath })
        .then(producer(subject, testsDirPath))
        .then(passer(timerSetter(timeLimit))())
        .then(consumer({
            className,
            codeFilePath,
            outDirPath,
            testsDirPath,
        }))
        .then(clearTimer);
};
