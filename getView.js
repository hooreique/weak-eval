import { readdir } from 'node:fs/promises';
import evaluate from './evaluate.js';
import { getPathPairMap, toFileHandlePromisePairMap } from './tcPair.js'

const createViewAndEvaluate = (fileHandlePromisePairMap, { classPath, className }) => {
    const view = new Map();

    fileHandlePromisePairMap.forEach((fileHandlePromisePair, key) => {
        view.set(key, evaluate(fileHandlePromisePair, { classPath, className })
            .catch(err => null));
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
