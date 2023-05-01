import compiler from './compiler.mjs';
import consumer from './consumer.mjs';
import producer from './producer.mjs';

export default ({
    compileOption,
    runOption,
    keyDirPath,
    keyOrderAsc,
    maxCapacity,
    frameInterval,
    columnCount,
    info,
}) => {
    return Promise.resolve()
        .then(compiler(compileOption))
        .then(producer(runOption, keyDirPath, keyOrderAsc, maxCapacity))
        .then(consumer(info, frameInterval, columnCount));
};
