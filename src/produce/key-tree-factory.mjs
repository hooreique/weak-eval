import { join, parse } from 'node:path';

export default (keyDirPath, natural = false) =>
    fileNames => {
        const keyTree = new Map();

        (natural ? fileNames : fileNames.reverse()).forEach(fileName => {
            const path = join(keyDirPath, fileName);
            const parsed = parse(path);
            const name = parsed.name;
            const ext = parsed.ext;

            const subKeyTree = keyTree.get(name) || new Map();
            keyTree.set(name, subKeyTree);

            subKeyTree.set(ext, path);
        });

        return keyTree;
    };
