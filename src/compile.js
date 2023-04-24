import simpleCmdSpawn from './util/simple-cmd-spawn.js';

export default ({ classPath, codeFilePath }) =>
    simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        classPath,
        codeFilePath,
    ]);
