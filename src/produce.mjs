import { readdir } from 'node:fs/promises';
import { getConfig } from './config.mjs';
import toKeyPairQueue from './produce/key-transformer.mjs';
import getKeyTree from './produce/key-tree.mjs';
import getView from './produce/view.mjs';

export default () => {
    const { keyDirPath } = getConfig().producingOption;

    return readdir(keyDirPath)
        .then(getKeyTree)
        .then(toKeyPairQueue)
        .then(getView);
};
