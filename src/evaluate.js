import { spawn } from 'node:child_process';
import { listen } from './util/channel.js';

/**
 * @return Promise fulfilled with result.
 * true if the answer is correct,
 * false if the answer is incorrect,
 * null if time is out.
 */
export default (
    { classPath, className },
    [inFileHandlePromise, outFileHandlePromise],
) => {

    inFileHandlePromise.then(fileHandle => fileHandle.close());
    outFileHandlePromise.then(fileHandle => fileHandle.close());

    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    let timeoutIdIn;
    let timeoutIdOut;

    return new Promise((resolve, reject) => {
        timeoutIdIn = setTimeout(() => {
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            resolve(Math.random() < 0.5);
        }, getRandomArbitrary(1_000, 4_000));

        timeoutIdOut = setTimeout(() => {
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            resolve(null);
        }, 3_000);

        listen('TIMEOUT')(() => {
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            reject();
        });
    });

    // return inFileHandlePromise
    //     .then(inFileHandle => {

    //         const process = spawn('cmd.exe', [
    //             '/c',
    //             'java',
    //             '-Dfile.encoding=UTF-8',
    //             '-cp',
    //             classPath,
    //             className,
    //         ]);

    //         const inStream = inFileHandle.createReadStream();

    //         inStream.pipe(process.stdin);

    //         return { inFileHandle, process };
    //     })
    //     .then(({ inFileHandle, process }) => {
    //         // TODO: outStream, process.stdout
    //         //   두 스트림을 비교하는 구현
    //         //   스트림 데이터를 토크나이징 해서 한 토큰 한 토큰씩 비교하기
    //     });
};
