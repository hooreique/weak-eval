import { spawn } from 'node:child_process';
import { open } from 'node:fs/promises';
import { channel } from './domain/channel.js';
import { result } from './domain/result.js';
import { subscribe, unsubscribe } from './util/subscription.js';

/**
 * @return Promise fulfilled with result.
 * CORRECT true if the answer is correct,
 * INCORRECT if the answer is incorrect,
 * TIMEOVER if time is over.
 * TIMEOUT if application timer rings.
 */
export default (
    { classPath, className },
    [inPath, outPath],
) => {

    // /*
    open(inPath).then(fileHandle => fileHandle.close());
    open(outPath).then(fileHandle => fileHandle.close());

    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    return new Promise((resolve, reject) => {
        let timeoutIdIn;
        let timeoutIdOut;
        let subscriptionId;

        timeoutIdIn = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            resolve(Math.random() < 0.5 ? result.CORRECT : result.INCORRECT);
        }, getRandomArbitrary(1_000, 4_000));

        timeoutIdOut = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            resolve(result.TIMEOVER);
        }, 3_000);

        subscriptionId = subscribe(channel.TIMEOUT)(() => {
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            reject(result.TIMEOUT);
        });
    });
    // */

    /*
    return open(inPath).then(inFileHandle => {
        open(outPath).then(outFileHandle => {
        });
    })
        .then(inFileHandle => {

            const process = spawn('cmd.exe', [
                '/c',
                'java',
                '-Dfile.encoding=UTF-8',
                '-cp',
                classPath,
                className,
            ]);

            const inStream = inFileHandle.createReadStream();

            inStream.pipe(process.stdin);

            return { inFileHandle, process };
        })
        .then(({ inFileHandle, process }) => {
            // TODO: outStream, process.stdout
            //   두 스트림을 비교하는 구현
            //   스트림 데이터를 토크나이징 해서 한 토큰 한 토큰씩 비교하기
        });
    */
};
