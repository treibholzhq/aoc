import { fromFile } from 'gen-readlines';

const orderMap = new Map();
let x = true;
let sum = 0;

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();

  if (l === '') {
    x = false;
    continue;
  }

  if (x) {
    const [before, after] = l.split('|').map((s) => parseInt(s));
    if (orderMap.has(after)) {
      orderMap.get(after).push(before);
    } else {
      orderMap.set(after, [before]);
    }

    continue;
  }

  const update = l.split(',').map((s) => parseInt(s));
  const mid = Math.floor(update.length / 2);
  let valid = true;

  for (let i = 0, j = i + 1; i < update.length - 1; i++, j++) {
    const [page1, page2] = [update[i], update[j]];
    if (orderMap.has(page1) && orderMap.get(page1).includes(page2)) {
      valid = false;
      break;
    }
  }

  sum += valid ? update[mid] : 0;
}

console.log('Sum of middle pages:', sum);
