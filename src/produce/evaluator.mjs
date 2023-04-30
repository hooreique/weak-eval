import answerFactory from './evaluate/answer-factory.mjs';
import resultFactory from './evaluate/result-factory.mjs';

export default (runOption, [inKey, outKey]) =>
    Promise.resolve()
        .then(answerFactory(runOption, inKey))
        .then(resultFactory(outKey));
