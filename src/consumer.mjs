import format from './consume/info-display.mjs';
import render from './consume/render.mjs';
import report from './consume/report.mjs';
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
                        .then(() => report(view, reportDirPath))
                        .then(resolve)
                );
            });
        });
    };
