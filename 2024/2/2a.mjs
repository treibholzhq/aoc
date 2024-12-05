import { fromFile } from 'gen-readlines';

let safe = 0;

for (const report of fromFile(`${import.meta.dirname}/input.txt`)) {
  const layers = report.toString().split(' ').map(v => parseInt(v));
  let m = 0;

  for (let i = 1; i < layers.length; i++) {
    const curr = layers[i];
    const prev = layers[i - 1];
    const diff = Math.abs(curr - prev);

    if (diff < 1 || diff > 3) {
      m = 0;
      break;
    }

    if ((m > 0 && curr < prev) || (m < 0 && curr > prev)) {
      m = 0;
      break;
    }

    if (m === 0) {
      m = prev < curr ? 1 : -1;
    }
  }

  if (m) safe++;
}

console.log('Safe reports:', safe);
