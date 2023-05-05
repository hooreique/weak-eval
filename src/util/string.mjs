export const prune = stringLike =>
    stringLike
        .toString()
        .trimEnd()
        .replaceAll(/[ \f\t\r]*\n/g, '\n');
