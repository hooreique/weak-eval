import simpleCmdSpawn from './util/simpleCmdSpawn.js';

export default ({ outDirPath, codeFilePath }) =>
    simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        outDirPath,
        codeFilePath,
    ]);
