import { join } from 'node:path';
import { throwNewError } from './util/error.mjs';

const staticConfig = {
    runnerBaseDir: '.\\src\\language',
    language: {
        java: {
            code: 'Main',
            runner: 'MainRunner',
            ext: '.java',
            command: {
                compile: 'javac',
                run: 'java',
            },
            defaultTimeLimit: 2_000,
        },
    },
};

const configurer = lang => {
    const runnerDirPath = join(staticConfig.runnerBaseDir, lang);

    return {
        // javac -encoding UTF-8 -d out -cp src;sol src/MainRunner.java
        getCompileArgs: (outDirPath, codeDirPath) => [
            '-encoding',
            'UTF-8',
            '-d',
            outDirPath,
            '-cp',
            [runnerDirPath, codeDirPath].join(';'),
            join(
                runnerDirPath,
                staticConfig.language[lang].runner +
                    staticConfig.language[lang].ext
            ),
        ],
        // java -Dfile.encoding=UTF-8 -cp out MainRunner
        getRunArgs: outDirPath => [
            '-Dfile.encoding=UTF-8',
            '-cp',
            outDirPath,
            staticConfig.language[lang].runner,
        ],
    };
};

const supportedLanguages = new Set(['java']);
const isSupported = lang => supportedLanguages.has(lang);

export default (dir, config, language) => () => {
    const lang = language.toLowerCase();
    if (!isSupported(lang))
        throwNewError(`${lang.toUpperCase()} is currently not supported.`);

    const codeDirPath = join(dir, config?.codeDirName || 'solutions');
    const outDirPath = join(dir, config?.outDirName || 'out');
    const keyDirPath = join(dir, config?.keyDirName || 'tests');
    const reportDirPath = join(dir, config?.reportDirName || 'report');
    const keyOrderAsc = config?.keyOrderAsc ? true : false;
    const maxCapacity = config?.maxCapacity || 4;
    const frameInterval = config?.frameInterval || 300;
    const columnCount = config?.columnCount || 4;
    const timeLimit =
        config?.timeLimit?.[lang] ||
        staticConfig.language[java].defaultTimeLimit;

    const langConf = configurer(lang);

    const compileCommand = staticConfig.language[lang].command.compile;
    const compileArgs = langConf.getCompileArgs(outDirPath, codeDirPath);
    const runCommand = staticConfig.language[lang].command.run;
    const runArgs = langConf.getRunArgs(outDirPath);

    return {
        compileOption: {
            command: compileCommand,
            args: compileArgs,
        },
        producingOption: {
            runOption: {
                command: runCommand,
                args: runArgs,
                timeLimit,
            },
            keyDirPath,
            keyOrderAsc,
            maxCapacity,
        },
        consumingOption: {
            reportDirPath,
            frameInterval,
            columnCount,
            info: {
                Compile: [compileCommand, ...compileArgs].join(' '),
                Run: [runCommand, ...runArgs].join(' '),
                'Time limit': timeLimit + 'ms',
                'Key directory': keyDirPath,
            },
        },
    };
};
