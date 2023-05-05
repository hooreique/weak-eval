import { log } from 'node:console';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { result as r } from '../domain/result.mjs';
import { alignment, format } from '../util/csv.mjs';
import { throwNewError } from '../util/error.mjs';

const getDateTimeString = () => {
    const iso = new Date().toISOString();
    return iso.substring(0, iso.lastIndexOf('.')).replaceAll(':', '');
};

export default async (view, reportDirPath) => {
    const body = [];

    for (const [keyId, resultPromise] of view) {
        const result = await resultPromise;
        body.push([
            /* ID     */ keyId,
            /* Pass   */ result.value === r.CORRECT ? 'Y' : 'N',
            /* Result */ result.value.name,
            /* Time   */ isNaN(result.time) ? '-1' : '' + result.time,
        ]);
    }

    const csv = format(['ID', 'Pass', 'Result', 'Time'], body, [
        alignment.R,
        alignment.L,
        alignment.L,
        alignment.R,
    ]);

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
