import { readdir } from 'node:fs/promises';
import keyTreeFactory from './key-tree-factory.mjs';
import toKeyPairQueue from './key-transformer.mjs';
import viewFactory from './view-factory.mjs';

export default (runOption, keyDirPath, maxCapacity) => () =>
    readdir(keyDirPath)
        .then(keyTreeFactory(keyDirPath))
        .then(toKeyPairQueue)
        .then(viewFactory(runOption, maxCapacity));
