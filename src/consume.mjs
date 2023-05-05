import { log } from 'node:console';
import { getConfig } from './config.mjs';
import format from './consume/info-display.mjs';
import render from './consume/render.mjs';
import reporter from './consume/reporter.mjs';
import { subscribe } from './util/single-pub-sub.mjs';

export default view => {
    const { info, frameInterval } = getConfig().consumingOption;

    const formattedInfo = format(info);

    const intervalId = setInterval(
        () => render(view, formattedInfo),
        frameInterval
    );

    return new Promise(resolve => {
        subscribe(() => {
            clearInterval(intervalId);
            setImmediate(() =>
                render(view, formattedInfo)
                    .then(() => log('Evaluation has been completed.'))
                    .then(reporter(view))
                    .then(resolve)
            );
        });
    });
};
