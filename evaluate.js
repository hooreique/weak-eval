import {spawn} from 'node:child_process';

const evaluate = ([inFileHandlePromise, outFileHandlePromise], {classPath, className}) => {
    // const process = spawn('cmd.exe', [
    //     '/c',
    //     'java',
    //     '-Dfile.encoding=UTF-8',
    //     '-cp',
    //     classPath,
    //     className,
    // ]);

    // inStream.pipe(process.stdin);

    inFileHandlePromise.then(fileHandle => fileHandle.close());
    outFileHandlePromise.then(fileHandle => fileHandle.close());

    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            resolve();
        }, getRandomArbitrary(1_000, 6_000));

        setTimeout(() => {
            clearTimeout(timeoutId);
            reject('랜덤하게 실패하기');
        }, 5_000);
    });
};

export default evaluate;
