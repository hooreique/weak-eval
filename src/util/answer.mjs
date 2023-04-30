const cleanAnswer = string =>
    string.trimEnd().replaceAll(/[ \f\t\r]*\n/g, '\n');

export const newAnswer = () => {
    const array = [];
    const answer = {
        push: data => array.push(data),
        toString: () => array.map(data => data.toString()).join(''),
        equals: o =>
            cleanAnswer(o.toString()) === cleanAnswer(answer.toString()),
    };
    return answer;
};
