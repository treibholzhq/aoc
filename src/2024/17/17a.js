import { fromFile } from 'gen-readlines';

const prog = [];
const registers = {};

[...fromFile(`${import.meta.dirname}/input.txt`)]
  .map((l) => l.toString().split(' '))
  .forEach((l) => {
    if ('R' === l[0][0]) registers[l[1][0]] = Number(l[2]);
    if ('P' === l[0][0]) prog.push(...l[1].split(',').map(Number));
  });

let { A, B, C } = registers;
let ptr = 0;
const out = [];

function value(operand) {
  if (operand === 4) return A;
  if (operand === 5) return B;
  if (operand === 6) return C;
  return operand;
}

while (ptr < prog.length) {
  const [opcode, operand] = [prog[ptr], prog[ptr + 1]];
  if (0 === opcode) A >>= value(operand); // right bit shift of n = division by 2^n
  if (1 === opcode) B ^= operand;
  if (2 === opcode) B = value(operand) % 8;
  if (3 === opcode) A !== 0 && (ptr = operand - 2);
  if (4 === opcode) B ^= C;
  if (5 === opcode) out.push(value(operand) % 8);
  if (6 === opcode) B = A >> value(operand);
  if (7 === opcode) C = A >> value(operand);
  ptr += 2;
}

console.log('Program:', prog.join(','));
console.log('Output:', out.join(','));
console.log('Registers:', `A:${A}`, `B:${B}`, `C:${C}`);
