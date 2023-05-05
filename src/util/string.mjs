export const prune = stringLike =>
    stringLike
        .toString()
        .trimEnd()
        .replaceAll(/[ \f\n\r\t]*\n/g, '\n');
