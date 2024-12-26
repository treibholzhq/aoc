import { fromFile } from 'gen-readlines';

let input = '';

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  input = `${input}${line.toString()}`;
}

const d = 'do()';
const dnt = "don't()";
let sum = 0;

do {
  const indexOfDont = input.indexOf(dnt);

  sum += input
    .substring(0, indexOfDont)
    .match(/mul\(([0-9]+),([0-9]+)\)/g)
    .map((mul) => mul.match(/([0-9]+),([0-9]+)/))
    .reduce((acc, curr) => acc + curr[1] * curr[2], 0);

  input = input.substring(indexOfDont);

  const indexOfDo = input.indexOf(d);

  if (indexOfDo === -1) {
    input = '';
  } else {
    input = input.substring(indexOfDo + d.length);
  }
} while (input.length);

console.log('Sum of multiplications:', sum);
