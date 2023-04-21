import { spawn } from 'node:child_process';

/*
 * 반환되는 프라미스에는
 *     정답시    true
 *     오답시    false
 *     시간초과시 null
 * 이 들어감
 */
const evaluate = (
    [inFileHandlePromise, outFileHandlePromise],
    { classPath, className },
) => {

    // inFileHandlePromise.then(fileHandle => fileHandle.close());
    // outFileHandlePromise.then(fileHandle => fileHandle.close());

    // const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

    // return new Promise((resolve, reject) => {
    //     const timeoutId = setTimeout(() => {
    //         resolve(Math.random() < 0.7);
    //     }, getRandomArbitrary(1_000, 6_000));

    //     setTimeout(() => {
    //         clearTimeout(timeoutId);
    //         reject('랜덤하게 실패하기');
    //     }, 5_000);
    // });

    return inFileHandlePromise
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
};

export default evaluate;
