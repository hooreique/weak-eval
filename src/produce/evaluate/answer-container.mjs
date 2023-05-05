import { Buffer } from 'node:buffer';

export default () => {
    const buffers = [];
    return {
        push: buffer => buffers.push(buffer),
        getAnswerAndDuration: () => {
            const answer = Buffer.concat(buffers).toString();

            const i = answer.lastIndexOf('^');
            const j = answer.lastIndexOf('$');

            return [
                answer.substring(0, i),
                parseInt(answer.substring(i + 1, j)),
            ];
        },
    };
};
