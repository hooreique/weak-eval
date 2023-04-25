import { readdir } from 'node:fs/promises';
import keyTreeFactory from './key-tree-factory.js';
import toKeyPairQueue from './key-transformer.js'
import viewFactory from './view-factory.js';

export default (subject, keyDirPath) => () => readdir(keyDirPath)
    .then(keyTreeFactory(keyDirPath))
    .then(toKeyPairQueue)
    .then(viewFactory(subject));
