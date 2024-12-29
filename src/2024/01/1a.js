import { fromFile } from 'gen-readlines';

const left = [];
const right = [];
const distances = [];

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const [l, r] = line
    .toString()
    .split('   ')
    .map((v) => parseInt(v));
  left.push(l);
  right.push(r);
}

left.sort();
right.sort();

left.forEach((l, i) => distances.push(Math.abs(l - right[i])));

console.log(
  'Total distance between lists:',
  distances.reduce((acc, curr) => acc + curr, 0)
);