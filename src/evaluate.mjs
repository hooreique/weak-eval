import resultFactory from './result-factory.mjs';
import answerFactory from './answer-factory.mjs';

export default (subject, [inKey, outKey]) =>
    Promise.resolve()
        .then(answerFactory(subject, inKey))
        .then(resultFactory(outKey));
