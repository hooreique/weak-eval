import compile from './compile.mjs';
import { setConfig } from './config.mjs';
import consume from './consume.mjs';
import produce from './produce.mjs';

export default (dir, language) => {
    setConfig(dir, language);

    return Promise.resolve().then(compile).then(produce).then(consume);
};
