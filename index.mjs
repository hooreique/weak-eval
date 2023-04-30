import { error } from 'node:console';
import { isAbsolute } from 'node:path';
import { argv, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import main from './src/main.mjs';
import { throwNewError } from './src/util/error.mjs';

const dir = argv[2];

const isProperDir = dir => dir && typeof dir === 'string' && isAbsolute(dir);

if (!isProperDir(dir))
    throwNewError({ message: 'Provide a proper absolute directory' });

const pause = () => {
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });

    rl.question('Press enter...').then(answer => rl.close());
};

main(dir).catch(error).finally(pause);
