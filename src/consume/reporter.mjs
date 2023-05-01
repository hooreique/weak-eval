import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import write from './write.mjs';

export default (view, reportDirPath) => () => {
    const rl = createInterface({ input: stdin, output: stdout });

    return new Promise((resolve, reject) => {
        rl.question('Want to get the result CSV file? (y/n) [n]: ')
            .then(answer => {
                if (answer.toLowerCase() === 'y') resolve();
                else reject();
            })
            .catch(reject)
            .finally(() => rl.close());
    })
        .then(() => write(view, reportDirPath))
        .catch(() => {});
};
