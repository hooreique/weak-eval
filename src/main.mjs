import compiler from './compiler.mjs';
import consumer from './consumer.mjs';
import producer from './producer.mjs';

export default ({
    compileOption,
    runOption,
    keyDirPath,
    maxCapacity,
    info,
    frameInterval,
}) =>
    Promise.resolve()
        .then(compiler(compileOption))
        .then(producer(runOption, keyDirPath, maxCapacity))
        .then(consumer(info, frameInterval));
