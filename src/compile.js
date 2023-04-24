import simpleCmdSpawn from './util/simpleCmdSpawn.js';

export default ({ classPath, codeFilePath }) =>
    simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        classPath,
        codeFilePath,
    ]);
