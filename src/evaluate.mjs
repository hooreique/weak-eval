import resultFactory from './result-factory.mjs';
import answerFactory from './answer-factory.mjs';

export default (runOption, [inKey, outKey]) =>
    Promise.resolve()
        .then(answerFactory(runOption, inKey))
        .then(resultFactory(outKey));
