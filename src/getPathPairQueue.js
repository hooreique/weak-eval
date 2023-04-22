import { isAbsolute, join, parse } from 'node:path';
import { newQueueFromMap } from './util/queueUtil.js';

const isValidPathPair = pathPair => pathPair &&
    Array.isArray(pathPair) &&
    pathPair.length === 2 &&
    pathPair[0] &&
    pathPair[1] &&
    typeof pathPair[0] === 'string' &&
    typeof pathPair[1] === 'string' &&
    pathPair[0].endsWith('.in') &&
    pathPair[1].endsWith('.out') &&
    isAbsolute(pathPair[0]) &&
    isAbsolute(pathPair[1]);

export default (dirPath, basenames) => {
    const pathPairMap = new Map();

    basenames.forEach(basename => {
        const filePath = join(dirPath, basename);
        const parsed = parse(filePath);

        pathPairMap.set(parsed.name, parsed.ext === '.in' ?
            filePath : parsed.ext === '.out' ?
                [pathPairMap.get(parsed.name), filePath] :
                pathPairMap.get(parsed.name));
    });

    // pathPairMap.set('foo', ['.in', '.ou']);
    // pathPairMap.set('bar', [undefined, '.out']);
    // pathPairMap.set('!!!', ['.in', '.out']);

    pathPairMap.forEach((pathPair, key, map) => {
        if (!isValidPathPair(pathPair)) map.delete(key);
    });

    return newQueueFromMap(pathPairMap);
};
