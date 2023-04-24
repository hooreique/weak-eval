import print from './print.js';
import { channel } from './domain/channel.js';
import { subscribe } from './util/pub-sub.js';

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
