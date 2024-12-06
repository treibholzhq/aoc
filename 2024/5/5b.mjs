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

  const finderr = () => {
    for (let i = 0, j = i + 1; i < update.length - 1; i++, j++) {
      const [page1, page2] = [update[i], update[j]];
      if (orderMap.has(page1) && orderMap.get(page1).includes(page2)) {
        return i;
      }
    }
  };

  let err = finderr();

  if (err === undefined) continue;

  do {
    const [k, l] = [update[err], update[err + 1]];
    update[err] = l;
    update[err + 1] = k;
    err = finderr();
  } while (err !== undefined);

  sum += update[mid];
}

console.log('Sum of middle pages:', sum);
