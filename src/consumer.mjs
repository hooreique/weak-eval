import { clear, log } from 'node:console';
import print from './print.mjs';
import { channel } from './domain/channel.mjs';
import { subscribe } from './util/pub-sub.mjs';

export default (info, interval = 233) =>
    view => {
        const renderFrame = () => {
            /*
            clear();
            log(info);
            */
            return print(view);
        };

        return new Promise(resolve => {
            const intervalId = setInterval(renderFrame, interval);

            subscribe(channel.COMPLETE, () =>
                setImmediate(() => {
                    clearInterval(intervalId);
                    renderFrame().then(resolve);
                })
            );
        });
    };
