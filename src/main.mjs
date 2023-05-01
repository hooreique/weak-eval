import compiler from './compiler.mjs';
import consumer from './consumer.mjs';
import producer from './producer.mjs';

export default ({ compileOption, producingOption, consumingOption }) => {
    return Promise.resolve()
        .then(compiler(compileOption))
        .then(producer(producingOption))
        .then(consumer(consumingOption));
};
