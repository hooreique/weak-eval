import { isAbsolute } from 'node:path';
import { createInterface } from 'node:readline/promises';
import main from './main.js';

const dir = process.argv[2];

if (dir && typeof dir === 'string' && isAbsolute(dir)) console.log('dir:', dir);
else throw new Error('Provide a proper absolute directory');

const pause = () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Press enter...').then(answer => rl.close());
};

main(dir)
    .catch(console.error)
    .finally(() => pause());
