import print from './print.mjs';
import { channel } from './domain/channel.mjs';
import { subscribe } from './util/pub-sub.mjs';

export default (info, interval = 233) => view => {

    const renderFrame = () => {
        /*
        console.clear();
        console.log(info);
        */
        return print(view);
    };

    return new Promise(resolve => {
        const intervalId = setInterval(renderFrame, interval);

        const onEnd = () => {
            clearInterval(intervalId);
            renderFrame().then(resolve);
        };

        subscribe(channel.COMPLETE, onEnd);
        subscribe(channel.TIMEOUT, onEnd);
    });
};
