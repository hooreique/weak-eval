import { error } from 'node:console';
import { argv, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import main from './src/main.mjs';

const pause = () => {
    const rl = createInterface({ input: stdin, output: stdout });

    rl.question('Press enter...')
        .catch(error)
        .finally(() => rl.close());
};

main(argv[2], 'Java').catch(error).finally(pause);
