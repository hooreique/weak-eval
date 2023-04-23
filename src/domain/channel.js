
const COMPLETE = { message: '채점 완료' };
const TIMEOUT = { message: '채점이 너무 오래 걸립니다. 프로그램을 종료합니다.' };

export const channel = {
    COMPLETE,
    TIMEOUT,
};

export const channels = {
    [COMPLETE]: COMPLETE,
    [TIMEOUT]: TIMEOUT,
};
