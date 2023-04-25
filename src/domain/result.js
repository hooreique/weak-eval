
const PENDING = { message: '채점 중...' };
const CORRECT = { message: '정답입니다.' };
const INCORRECT = { message: '틀렸습니다.' };
const TIMEOVER = { message: '시간 초과' };
const TIMEOUT = { message: '채점 종료됨' };
const ERROR = { message: '런타임 에러' };
const UNKNOWN = { message: '알 수 없음' };

export const getMessage = result => result?.message || UNKNOWN.message;

export const result = {
    PENDING,
    CORRECT,
    INCORRECT,
    TIMEOVER,
    TIMEOUT,
    ERROR,
    UNKNOWN,
};
