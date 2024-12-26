import { fromFile } from 'gen-readlines';

export default function cramer(addToPrize = 0) {
  const equationSystems = [];

  let eq = {};
  for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
    const l = line.toString();

    if (l.startsWith('Button A:')) {
      const [, ax, ay] = l.match(/Button A: X\+([0-9]+), Y\+([0-9]+)/);
      eq.ax = parseInt(ax);
      eq.ay = parseInt(ay);
    } else if (l.startsWith('Button B:')) {
      const [, bx, by] = l.match(/Button B: X\+([0-9]+), Y\+([0-9]+)/);
      eq.bx = parseInt(bx);
      eq.by = parseInt(by);
    } else if (l.startsWith('Prize:')) {
      const [, px, py] = l.match(/Prize: X=([0-9]+), Y=([0-9]+)/);
      eq.px = parseInt(px) + addToPrize;
      eq.py = parseInt(py) + addToPrize;
    } else {
      equationSystems.push(eq);
      eq = {};
    }
  }
  equationSystems.push(eq);

  return equationSystems.reduce((acc, { ax, ay, bx, by, px, py }) => {
    // Cramers rule (https://www.cuemath.com/algebra/cramers-rule/)
    const x = (px * by - py * bx) / (ax * by - ay * bx);
    const y = (ax * py - ay * px) / (ax * by - ay * bx);
    return Number.isInteger(x) && Number.isInteger(y) ? acc + x * 3 + y : acc;
  }, 0);
}
