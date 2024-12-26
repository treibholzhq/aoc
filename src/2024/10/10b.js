import { fromFile } from 'gen-readlines';

const map = [];
const paths = [];
const scores = new Map();

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  map.push(
    line
      .toString()
      .split('')
      .map((c) => parseInt(c))
  );
}

function getNextPositions({ x, y }) {
  const next = [];

  if (x - 1 >= 0 && map[y][x - 1] === map[y][x] + 1) {
    next.push({ x: x - 1, y });
  }

  if (x + 1 < map[0].length && map[y][x + 1] === map[y][x] + 1) {
    next.push({ x: x + 1, y });
  }

  if (y - 1 >= 0 && map[y - 1][x] === map[y][x] + 1) {
    next.push({ x, y: y - 1 });
  }

  if (y + 1 < map.length && map[y + 1][x] === map[y][x] + 1) {
    next.push({ x, y: y + 1 });
  }

  return next;
}

function updateScore(path, { x, y }) {
  if (map[y][x] === 9) {
    paths.push([...path, { x, y }]);

    const head = path[0];

    const k = `${head.x}|${head.y}`;
    const score = scores.get(k) || [];
    score.push({ x, y });
    scores.set(k, score);

    return true;
  }
  return false;
}

function move(path) {
  for (const pos of getNextPositions(path[path.length - 1])) {
    if (!updateScore(path, pos)) {
      move([...path, pos]);
    }
  }
}

function findHeads() {
  const trailHeads = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        trailHeads.push({ x, y });
      }
    }
  }
  return trailHeads;
}

for (const pos of findHeads()) {
  move([pos]);
}

console.log(
  'Score:',
  [...scores.values()].reduce((acc, curr) => acc + curr.length, 0)
);
