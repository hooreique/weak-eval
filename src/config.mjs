import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { throwNewError } from './util/error.mjs';

const supportedLangs = new Set(['java']);

const staticConfig = {
    configFileName: 'weak-eval-config.json',
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

const languageConfigurer = lang => {
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

const isProperDir = dir => dir && typeof dir === 'string' && isAbsolute(dir);

const isSupported = lang => supportedLangs.has(lang);

let config = null;
let dir = '';
let lang = '';
let setAt = 0;
let gotAt = -1;

export const setConfig = (_dir, language) => {
    const _lang = language.toLowerCase();

    if (!isProperDir(_dir))
        throwNewError('Provide a proper absolute subject directory.');

    if (!isSupported(_lang))
        throwNewError(`${_lang.toUpperCase()} is currently not supported.`);

    dir = _dir;
    lang = _lang;
    ++setAt;
};

export const getConfig = () => {
    if (config !== null && gotAt === setAt) return config;

    if (dir === '' || lang === '')
        throwNewError('Set the config before getting it.');

    let configFromFile;
    try {
        configFromFile = JSON.parse(
            readFileSync(join(dir, staticConfig.configFileName))
        );
    } catch (err) {
        throwNewError(
            `Provide a proper \`${staticConfig.configFileName}\` in the base directory.`
        );
    }

    const codeDirPath = join(dir, configFromFile?.codeDirName || 'solutions');
    const outDirPath = join(dir, configFromFile?.outDirName || 'out');
    const keyDirPath = join(dir, configFromFile?.keyDirName || 'tests');
    const reportDirPath = join(dir, configFromFile?.reportDirName || 'report');
    const keyOrderAsc = configFromFile?.keyOrderAsc ? true : false;
    const maxCapacity = configFromFile?.maxCapacity || 4;
    const frameInterval = configFromFile?.frameInterval || 300;
    const columnCount = configFromFile?.columnCount || 4;
    const timeLimit =
        configFromFile?.timeLimit?.[lang] ||
        staticConfig.language[java].defaultTimeLimit;

    const languageConfig = languageConfigurer(lang);

    const compileCommand = staticConfig.language[lang].command.compile;
    const compileArgs = languageConfig.getCompileArgs(outDirPath, codeDirPath);
    const runCommand = staticConfig.language[lang].command.run;
    const runArgs = languageConfig.getRunArgs(outDirPath);

    gotAt = setAt;

    return (config = {
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
    });
};
