import print from './print.js';
import { listen } from './util/channel.js';

export default (view, info, interval = 500) => {

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

        const end = () => {
            clearInterval(intervalId);
            renderFrame().then(resolve);
        };

        listen('COMPLETE')(end);
        listen('TIMEOUT')(end);
    });
};
