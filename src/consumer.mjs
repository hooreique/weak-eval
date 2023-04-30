import format from './info-display.mjs';
import render from './render.mjs';
import { channel } from './domain/channel.mjs';
import { subscribe } from './util/pub-sub.mjs';

export default (info, frameInterval) => view => {
    const formattedInfo = format(info);

    const intervalId = setInterval(
        () => render(view, formattedInfo),
        frameInterval
    );

    return new Promise(resolve => {
        subscribe(channel.COMPLETE, () => {
            clearInterval(intervalId);
            setImmediate(() => render(view, formattedInfo).then(resolve));
        });
    });
};
