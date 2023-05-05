import answerFactory from './evaluate/answer-factory.mjs';
import resultFactory from './evaluate/result-factory.mjs';

export default ([inKey, outKey]) => {
    return Promise.resolve()
        .then(answerFactory(inKey))
        .then(resultFactory(outKey));
};
