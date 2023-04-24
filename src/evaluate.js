import { channel } from './domain/channel.js';
import { result } from './domain/result.js';
import { subscribe, unsubscribe } from './util/pub-sub.js';

/**
 * @return Promise fulfilled with result.
 * CORRECT if the answer is correct,
 * INCORRECT if the answer is incorrect,
 * TIMEOVER if time is over.
 * TIMEOUT if application timer rings.
 */
export default (subject, [inKey, outKey]) => {

    // /*
    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    return new Promise((resolve, reject) => {
        let timeoutIdIn;
        let timeoutIdOut;
        let subscriptionId;

        timeoutIdIn = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdOut) clearTimeout(timeoutIdOut);
            resolve(Math.random() < 0.5 ? result.CORRECT : result.INCORRECT);
        }, getRandomArbitrary(300, 900));

        timeoutIdOut = setTimeout(() => {
            if (subscriptionId) unsubscribe(subscriptionId);
            if (timeoutIdIn) clearTimeout(timeoutIdIn);
            resolve(result.TIMEOVER);
        }, 700);

        subscriptionId = subscribe(channel.TIMEOUT, () => {
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

            const childProcess = spawn('cmd.exe', [
                '/c',
                'java',
                '-Dfile.encoding=UTF-8',
                '-cp',
                classPath,
                className,
            ]);

            const inStream = inFileHandle.createReadStream();

            inStream.pipe(childProcess.stdin);

            return { inFileHandle, childProcess };
        })
        .then(({ inFileHandle, childProcess }) => {
            // TODO: outStream, childProcess.stdout
            //   두 스트림을 비교하는 구현
            //   스트림 데이터를 토크나이징 해서 한 토큰 한 토큰씩 비교하기
        });
    */
};
