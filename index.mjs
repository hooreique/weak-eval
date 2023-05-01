import { error } from 'node:console';
import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { argv, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import configurer from './src/configurer.mjs';
import main from './src/main.mjs';

const dir = argv[2];

const isProperDir = dir => dir && typeof dir === 'string' && isAbsolute(dir);

if (!isProperDir(dir))
    throw new Error('Provide a proper absolute subject directory.');

let config;
try {
    config = JSON.parse(readFileSync('./config.json'));
} catch (err) {
    throw new Error('Provide a proper config.json in the working directory.');
}

const pause = () => {
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });

    rl.question('Press enter...')
        .catch(() => {})
        .finally(() => rl.close());
};

Promise.resolve()
    .then(configurer(dir, config, 'Java'))
    .then(main)
    .catch(error)
    .finally(pause);
