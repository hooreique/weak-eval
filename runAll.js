import { open, readdir } from 'node:fs/promises';
import path from 'node:path';
import runOne from './runOne.js';

const isValidPathPair = pathPair => pathPair &&
    Array.isArray(pathPair) &&
    pathPair.length === 2 &&
    pathPair[0] &&
    pathPair[1] &&
    typeof pathPair[0] === 'string' &&
    typeof pathPair[1] === 'string' &&
    pathPair[0].endsWith('.in') &&
    pathPair[1].endsWith('.out') &&
    path.isAbsolute(pathPair[0]) &&
    path.isAbsolute(pathPair[1]);

const getPathPairMap = (dirPath, basenames) => {
    const pathPairMap = new Map();

    basenames.forEach(basename => {
        const filePath = path.join(dirPath, basename);
        const parsed = path.parse(filePath);

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

    return pathPairMap;
};

const toStreamPairMap = pathPairMap => {
    const streamPairMap = new Map();
    pathPairMap.forEach((pathPair, key) => {
        streamPairMap.set(key, [
            open(pathPair[0]).then(fd => fd.createReadStream()),
            open(pathPair[1]).then(fd => fd.createReadStream()),
        ]);
    });
    return streamPairMap;
};

const runAll = ({
    className,
    outDirPath,
    testsDirPath,
}) => {
    console.log('className:', className,
        '\noutDir:', outDirPath,
        '\ntestsDir:', testsDirPath);

    return readdir(testsDirPath)
        .then(testFileBasenames => getPathPairMap(testsDirPath, testFileBasenames))
        .then(toStreamPairMap)
        .then(testFileStreamPairMap => [...testFileStreamPairMap])
        .then(tests => Promise.all(tests.map(runOne)))
        .then(console.log);
};

export default runAll;
