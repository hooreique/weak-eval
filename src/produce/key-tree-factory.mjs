import { join, parse } from 'node:path';

export default (keyDirPath, keyOrderAsc = false) =>
    fileNames => {
        const keyTree = new Map();

        // /* 전부 다 돌리기
        (keyOrderAsc ? fileNames : fileNames.reverse()).forEach(fileName => {
            const path = join(keyDirPath, fileName);
            const parsed = parse(path);
            const name = parsed.name;
            const ext = parsed.ext;

            const subKeyTree = keyTree.get(name) || new Map();
            keyTree.set(name, subKeyTree);

            subKeyTree.set(ext, path);
        });
        // */

        /* 앞 N 쌍만 돌려 보기
        const N = 10;
        for (let i = 0, n = N * 2; i < n; ++i) {
            const fileName = fileNames[i];
            if (!fileName) break;

            const path = join(keyDirPath, fileName);
            const parsed = parse(path);
            const name = parsed.name;
            const ext = parsed.ext;

            const subKeyTree = keyTree.get(name) || new Map();
            keyTree.set(name, subKeyTree);

            subKeyTree.set(ext, path);
        }
        // */

        return keyTree;
    };
