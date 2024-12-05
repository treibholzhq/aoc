import { fromFile } from 'gen-readlines';

const left = [];
const right = new Map();

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const [l, r] = line
    .toString()
    .split('   ')
    .map((v) => parseInt(v));
  left.push(l);
  right.set(r, right.has(r) ? right.get(r) + 1 : 1);
}

console.log(
  'Similarity score:',
  left.reduce((acc, curr) => acc + curr * (right.get(curr) ?? 0), 0)
);
