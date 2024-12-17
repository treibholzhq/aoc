import { fromFile } from 'gen-readlines';

const operators = ['+', '*', '||'];
let total = 0;

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString().split(': ');

  const testValue = parseInt(l.shift());
  const operands = l[0].split(' ').map((o) => parseInt(o));
  const permutations = new Array(
    Math.pow(operators.length, operands.length - 1)
  );

  let currentEquation = [];

  for (let i = 0; i < permutations.length; i++) {
    currentEquation.push(operands[0]);

    let num = i;
    for (let j = 1; j < operands.length; j++) {
      currentEquation.push(operators[Math.ceil(num % operators.length)]);
      num = Math.floor(num / operators.length);
      currentEquation.push(operands[j]);
    }

    permutations[i] = currentEquation;
    currentEquation = [];
  }

  for (const equation of permutations) {
    let result = equation[0];

    for (let i = 1; i < equation.length; i += 2) {
      if (equation[i] === '+') result += equation[i + 1];
      if (equation[i] === '*') result *= equation[i + 1];
      if (equation[i] === '||') {
        result = parseInt(`${result}${equation[i + 1]}`);
      }
    }

    if (result === testValue) {
      total += testValue;
      break;
    }
  }
}

console.log('Total calibration result', total);
