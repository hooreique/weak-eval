import { open, readdir } from 'node:fs/promises';
import path from 'node:path';
import evaluate from './evaluate.js';

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

const toFileHandlePromisePairMap = pathPairMap => {
    const fileHandlePromisePairMap = new Map();

    pathPairMap.forEach((pathPair, key) => {
        fileHandlePromisePairMap.set(key, [
            open(pathPair[0]),
            open(pathPair[1]),
        ]);
    });

    pathPairMap.clear();

    return fileHandlePromisePairMap;
};

const createViewAndEvaluate = (fileHandlePromisePairMap, { classPath, className }) => {
    const view = new Map();

    fileHandlePromisePairMap.forEach((fileHandlePromisePair, key) => {
        view.set(key, evaluate(fileHandlePromisePair, { classPath, className }).catch(() => { }));
    });

    fileHandlePromisePairMap.clear();

    return view;
};

const getView = (testsDirPath, { classPath, className }) => {
    console.log('testsDirPath:', testsDirPath,
        '\nclassPath:', classPath,
        '\nclassName:', className);

    return readdir(testsDirPath)
        .then(basenames => getPathPairMap(testsDirPath, basenames))
        .then(toFileHandlePromisePairMap)
        .then(fileHandlePromisePairMap =>
            createViewAndEvaluate(fileHandlePromisePairMap, { classPath, className }));
};

export default getView;
