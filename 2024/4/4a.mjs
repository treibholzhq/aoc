import { fromFile } from 'gen-readlines';

let horizontals = [];
let verticals = [];
let diagonals = [];

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  horizontals.push(line.toString());
}

const vecsize = horizontals.length;

for (let i = 0; i < vecsize; i++) {
  for (let v = 0; v < vecsize; v++) {
    verticals[v] = verticals[v] || '';
    verticals[v] += horizontals[i][v];
  }

  for (let d = 0, dd = i; dd >= 0; d++, dd--) {
    diagonals[i] = diagonals[i] || '';
    diagonals[i] += horizontals[d][dd];
  }

  for (let d = vecsize - 1 - i, dd = 0; d <= vecsize - 1; d++, dd++) {
    diagonals[vecsize + i] = diagonals[vecsize + i] || '';
    diagonals[vecsize + i] += horizontals[dd][d];
  }

  for (let d = vecsize - 1, dd = i + 1; d > i; d--, dd++) {
    diagonals[vecsize * 2 + i] = diagonals[vecsize * 2 + i] || '';
    diagonals[vecsize * 2 + i] += horizontals[dd][d];
  }

  for (let d = i + 1, dd = 0; d < vecsize; d++, dd++) {
    diagonals[vecsize * 3 + i - 1] = diagonals[vecsize * 3 + i - 1] || '';
    diagonals[vecsize * 3 + i - 1] += horizontals[d][dd];
  }
}

let count = 0;

[...horizontals, ...verticals, ...diagonals].forEach((line) => {
  count += (line.match(/XMAS/g) || []).length += (
    line.match(/SAMX/g) || []
  ).length;
});

console.log('Appearances:', count);
