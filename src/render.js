import print from './print.js';
import { channel } from './domain/channel.js';
import { subscribe } from './util/subscription.js';

export default (info, interval = 233) => view => {

    const meta = {
        counter: 0,
    };

    const renderFrame = () => {
        // console.clear();
        // console.log(info);
        return print(view, meta);
    };

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            renderFrame();
        }, interval);

        const onEnd = () => {
            clearInterval(intervalId);
            renderFrame().then(resolve);
        };

        subscribe(channel.COMPLETE, onEnd);
        subscribe(channel.TIMEOUT, onEnd);
    });
};
