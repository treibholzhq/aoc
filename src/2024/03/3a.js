import { fromFile } from 'gen-readlines';

let input = '';

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  input = `${input}${line.toString()}`;
}

console.log(
  'Sum of multiplications:',
  input
    .match(/mul\(([0-9]+),([0-9]+)\)/g)
    .map((mul) => mul.match(/([0-9]+),([0-9]+)/))
    .reduce((acc, curr) => acc + curr[1] * curr[2], 0)
);
