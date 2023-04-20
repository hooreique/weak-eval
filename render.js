
const print = async (view, meta) => {
  console.log(`frame #${++meta.cnt}`);

  const currentView = [];

  let waiting = false;

  for (let [key, promise] of view) {
    const value = await Promise.race([promise, meta.WAITING]);

    if (value === meta.WAITING) waiting = true;

    currentView.push([key, value === meta.WAITING ?
      '채점 중...' :
      value === undefined ?
        '시간 초과' :
        value ?
          '정답입니다.' : '틀렸습니다.']);
  }

  meta.done = !waiting;

  console.log(currentView);
};

const render = (view, interval = 100, timeout = 15_000) => new Promise((resolve, reject) => {
  const meta = {
    WAITING: {},
    cnt: 0,
    done: false,
  };

  const intervalId = setInterval(() => {
    if (meta.done) {
      clearInterval(intervalId);
      resolve();
    } else {
      console.clear();
      print(view, meta);
    }
  }, interval);

  setTimeout(() => {
    if (meta.done) {
      clearInterval(intervalId);
      resolve();
    } else {
      clearInterval(intervalId);
      reject('채점이 너무 오래 걸립니다.');
    }
  }, timeout);
});

export default render;
