import { isAbsolute } from 'node:path';
import { createInterface } from 'node:readline/promises';
import main from './main.js';

const dir = process.argv[2];

const isProperDir = dir => dir && typeof dir === 'string' && isAbsolute(dir);

if (!isProperDir(dir)) throw new Error('Provide a proper absolute directory');

const pause = () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Press enter...').then(answer => rl.close());
};

main(dir)
    .catch(console.error)
    .finally(pause);
