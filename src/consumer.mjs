import { log } from 'node:console';
import format from './consume/info-display.mjs';
import render from './consume/render.mjs';
import reporter from './consume/reporter.mjs';
import { subscribe } from './util/single-pub-sub.mjs';

export default ({ reportDirPath, info, frameInterval, columnCount }) =>
    view => {
        const formattedInfo = format(info);

        const intervalId = setInterval(
            () => render(view, formattedInfo, columnCount),
            frameInterval
        );

        return new Promise(resolve => {
            subscribe(() => {
                clearInterval(intervalId);
                setImmediate(() =>
                    render(view, formattedInfo, columnCount)
                        .then(() => log('Evaluation has been completed.'))
                        .then(reporter(view, reportDirPath))
                        .then(resolve)
                );
            });
        });
    };
