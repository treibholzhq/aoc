import { fromFile } from 'gen-readlines';

const prog = [];

[...fromFile(`${import.meta.dirname}/input.txt`)]
  .map((l) => l.toString().split(' '))
  .forEach((l) => {
    if ('P' === l[0][0]) prog.push(...l[1].split(',').map(BigInt));
  });

function exec(A) {
  let B = 0n;
  let C = 0n;
  let ptr = 0n;
  const out = [];
  const n = BigInt(prog.length);

  function value(operand) {
    if (operand === 4n) return A;
    if (operand === 5n) return B;
    if (operand === 6n) return C;
    return operand;
  }

  while (ptr < n) {
    const [opcode, operand] = [prog[ptr], prog[ptr + 1n]];
    if (0n === opcode) A >>= value(operand); // right bit shift of n = division by 2^n
    if (1n === opcode) B ^= operand;
    if (2n === opcode) B = value(operand) % 8n;
    if (3n === opcode) A !== 0n && (ptr = operand - 2n);
    if (4n === opcode) B ^= C;
    if (5n === opcode) out.push(value(operand) % 8n);
    if (6n === opcode) B = A >> value(operand);
    if (7n === opcode) C = A >> value(operand);
    ptr += 2n;
  }

  return out;
}

/**
 * we need to reconstruct `prog.length` digits.
 * we are doing this in reverse because we can reconstruct
 * each next digit (going backwards) by shifting A to the left
 * by 3 bits (= multiply by 8, see `disassembled.js` for hint),
 * then run the program and compare its output to the slice of
 * the program from current digit to the back.
 * then we just increment A by 1 and execute the program again
 * until we have found the digit.
 *
 * - exec(0) returns [1], which is not the correct last digit,
 *   so A is incremented by 1 and fed into exec again.
 *
 * - exec(1) returns [0], whis is the correct last digit.
 *
 * - A is shifted by 3 bits  (multiplied by 8), so the next call is
 *   exec(8), which returns [3,0], which matches the last 2 digits
 *
 * - A is again shifted by 3 bits, exec(64) returns [1,3,0], which
 *   does not match the last 3 digits, so A is incremented by one
 *   until it reaches 67, which returns [3,3,0], which matches the
 *   last 3 digits
 *
 * - A is shifted by 3 bits, exec(536) returns ...
 */
let A = 0n;
for (const i of [...Array(prog.length).keys()].reverse()) {
  A <<= 3n;
  while (exec(A).join('') !== prog.slice(i).join('')) {
    A++;
  }
}

console.log('Program:', prog.join(','));
console.log('Lowest A for exact copy:', A.toString());
