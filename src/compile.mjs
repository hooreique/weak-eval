import simpleCmdSpawn from './util/simple-cmd-spawn.mjs';

export default ({ classPath, codeFilePath }) =>
    simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        classPath,
        codeFilePath,
    ]);
