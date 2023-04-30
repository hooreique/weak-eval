import { join } from 'node:path';
import compiler from './compiler.mjs';
import consumer from './consumer.mjs';
import producer from './producer.mjs';

export default dir => {
    const className = 'Main';
    const classPath = join(dir, 'out');
    const keyDirPath = join(dir, 'tests');
    const codeFilePath = join(dir, 'solutions', className + '.java');

    const subject = {
        className,
        classPath,
        timeLimit: 3_000,
    };

    return Promise.resolve()
        .then(compiler({ classPath, codeFilePath }))
        .then(producer(subject, keyDirPath, 8))
        .then(
            consumer(
                {
                    className,
                    classPath,
                    keyDirPath,
                    codeFilePath,
                },
                233
            )
        );
};
