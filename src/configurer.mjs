import { join } from 'node:path';

export default (dir, config, lang) => () => {
    const codeName = config[lang].codeName;
    const outDirPath = join(dir, config.outDirName);
    const keyDirPath = join(dir, config.keyDirName);
    const codePath = join(
        dir,
        config.codeDirName,
        codeName + config[lang].codeExt
    );

    const compileArgs = config[lang].args.compile;
    compileArgs[compileArgs.lastIndexOf('$OUT_DIR_PATH')] = outDirPath;
    compileArgs[compileArgs.lastIndexOf('$CODE_PATH')] = codePath;

    const runArgs = config[lang].args.run;
    runArgs[runArgs.lastIndexOf('$OUT_DIR_PATH')] = outDirPath;
    runArgs[runArgs.lastIndexOf('$CODE_NAME')] = codeName;

    return {
        compileOption: {
            command: config[lang].command.compile,
            args: compileArgs,
        },
        runOption: {
            command: config[lang].command.run,
            args: runArgs,
            timeLimit: config[lang].timeLimit,
        },
        keyDirPath,
        maxCapacity: config.maxCapacity,
        info: {
            compile: `${config[lang].command.compile} ${compileArgs.join(' ')}`,
            run: `${config[lang].command.run} ${runArgs.join(' ')}`,
            timeLimit: `${config[lang].timeLimit}ms`,
            keyDirPath,
        },
        frameInterval: config.frameInterval,
    };
};
