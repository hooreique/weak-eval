export const prune = stringLike =>
    stringLike
        .toString()
        .trimEnd()
        .replaceAll(/[ \f\t\r]*\n/g, '\n');

export const newAnswer = () => {
    const array = [];
    const answer = {
        push: data => array.push(data),
        toString: () => array.map(data => data.toString()).join(''),
    };
    return answer;
};
