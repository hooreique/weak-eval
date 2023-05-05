import { isAbsolute } from 'node:path';
import { pipe } from '../util/pure.mjs';
import { wrap } from '../util/queue.mjs';

const isValid = keyPair =>
    keyPair &&
    Array.isArray(keyPair) &&
    keyPair.length === 2 &&
    keyPair[0] &&
    keyPair[1] &&
    typeof keyPair[0] === 'string' &&
    typeof keyPair[1] === 'string' &&
    keyPair[0].endsWith('.in') &&
    keyPair[1].endsWith('.out') &&
    isAbsolute(keyPair[0]) &&
    isAbsolute(keyPair[1]);

const filter = keyPairMap => {
    /* 잘못된 값 넣어 보기
    keyPairMap.set('foo', [undefined, '999.out']);
    keyPairMap.set('bar', ['999.in', '999.ou']);
    keyPairMap.set('!!!', ['999.in', '999.out']);
    // */

    keyPairMap.forEach((keyPair, keyId, map) => {
        if (!isValid(keyPair)) map.delete(keyId);
    });

    return keyPairMap;
};

const transform = keyTree => {
    const keyPairMap = new Map();

    keyTree.forEach((subKeyTree, keyId) => {
        keyPairMap.set(keyId, [subKeyTree.get('.in'), subKeyTree.get('.out')]);
        subKeyTree.clear();
    });
    keyTree.clear();

    return keyPairMap;
};

export default pipe(transform, filter, wrap);
