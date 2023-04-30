import { inspect } from 'node:util';

export const throwNewError = err => {
    throw new Error(inspect(err, { depth: Infinity, colors: true }));
};
