import {spawn} from 'node:child_process';

/*
 * test = ['test-name', [inStream, outStream]]
 */
const runOne = (test, classPath, className) => {
    const testName = test[0];
    const inStream = test[1][0];
    const outStream = test[1][1];

    const process = spawn('cmd.exe', [
        '/c',
        'java',
        '-Dfile.encoding=UTF-8',
        '-cp',
        classPath,
        className,
    ]);

    inStream.pipe(process.stdin);
};

export default runOne;
