import { join } from 'node:path';
import runAll from './runAll.js';
import simpleCmdSpawn from './simpleCmdSpawn.js';

const weakEval = (dir) => {
    const className = 'Main';
    const codeFilePath = join(dir, 'solutions', className + '.java');
    const outDirPath = join(dir, 'out');
    const testsDirPath = join(dir, 'tests');

    return simpleCmdSpawn('javac', [
        '-encoding',
        'UTF-8',
        '-d',
        outDirPath,
        codeFilePath,
    ])
        .then(() => runAll({
            className,
            outDirPath,
            testsDirPath,
        }));
};

export default weakEval;
