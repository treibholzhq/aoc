import { fromFile } from 'gen-readlines';

let gridSize = 0;
let guard;
const obstacles = new Map();
const path = [];

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();

  for (let j = 0; j < l.length; j++) {
    const vec = { x: j, y: gridSize };

    if (l[j] === '^') {
      guard = { ...vec, dir: '^' };
    }

    if (l[j] === '#') {
      if (obstacles.has(vec.x)) obstacles.get(vec.x).push(vec.y);
      else obstacles.set(vec.x, [vec.y]);
    }
  }

  gridSize++;
}

function isOutOfBounds(vec) {
  return vec.x < 0 || vec.x >= gridSize || vec.y < 0 || vec.y >= gridSize;
}

function containsObstacle(vec) {
  return obstacles.has(vec.x) && obstacles.get(vec.x).includes(vec.y);
}

function getNext() {
  if (guard.dir === '^') return { x: guard.x, y: guard.y - 1 };
  if (guard.dir === '>') return { x: guard.x + 1, y: guard.y };
  if (guard.dir === 'v') return { x: guard.x, y: guard.y + 1 };
  if (guard.dir === '<') return { x: guard.x - 1, y: guard.y };
}

function turn() {
  if (guard.dir === '^') guard.dir = '>';
  else if (guard.dir === '>') guard.dir = 'v';
  else if (guard.dir === 'v') guard.dir = '<';
  else if (guard.dir === '<') guard.dir = '^';
}

function recordPath() {
  if (path.some((p) => p.x === guard.x && p.y === guard.y)) return;
  path.push({ x: guard.x, y: guard.y });
}

function move() {
  recordPath();

  const next = getNext();

  if (isOutOfBounds(next)) {
    return;
  }

  if (containsObstacle(next)) {
    turn();
  } else {
    guard.x = next.x;
    guard.y = next.y;
  }

  move();
}

move();

console.log('Distinct positions:', path.length);
