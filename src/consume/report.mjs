import { log } from 'node:console';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { result } from '../domain/result.mjs';
import { throwNewError } from '../util/error.mjs';

const head = ['ID   ', 'Pass', 'Result   ', 'Time'];

const getDateTimeString = () => {
    const iso = new Date().toISOString();
    return iso.substring(0, iso.lastIndexOf('.')).replaceAll(':', '');
};

export default async (view, reportDirPath) => {
    const data = [[...head]];

    for (const [keyId, promise] of view) {
        const r = await promise;
        data.push([
            keyId,
            r.value === result.CORRECT ? 'Y   ' : 'N   ',
            r.value.name,
            isNaN(r.time) ? '-1' : '' + r.time,
        ]);
    }

    const csv = data.map(v => v.join('\t,')).join('\n') + '\n';

    return Promise.resolve()
        .then(() => log('Writing report...'))
        .then(() => mkdir(reportDirPath))
        .catch(err => {
            if (err?.code !== 'EEXIST')
                throwNewError('Something went wrong during making directory.');
        })
        .then(() =>
            writeFile(join(reportDirPath, getDateTimeString() + '.csv'), csv)
        )
        .then(() => log('Writing report has succeeded.'));
};
