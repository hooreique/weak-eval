import { readdir } from 'node:fs/promises';
import toKeyPairQueue from './produce/key-transformer.mjs';
import keyTreeFactory from './produce/key-tree-factory.mjs';
import viewFactory from './produce/view-factory.mjs';

export default (runOption, keyDirPath, keyOrderAsc, maxCapacity) => () => {
    return readdir(keyDirPath)
        .then(keyTreeFactory(keyDirPath, keyOrderAsc))
        .then(toKeyPairQueue)
        .then(viewFactory(runOption, maxCapacity));
};
