
const CORRECT = { message: '정답입니다.' };
const INCORRECT = { message: '틀렸습니다.' };
const TIMEOVER = { message: '시간 초과' };
const TIMEOUT = { message: '채점 종료됨' };

export const result = {
    CORRECT,
    INCORRECT,
    TIMEOVER,
    TIMEOUT,
};

export const results = {
    [CORRECT]: CORRECT,
    [INCORRECT]: INCORRECT,
    [TIMEOVER]: TIMEOVER,
    [TIMEOUT]: TIMEOUT,
};
