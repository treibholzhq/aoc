import { fromFile } from 'gen-readlines';

let gridSize = 0;
let guard;
const obstacles = {};
let possibleObstacles = 0;

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();

  for (let j = 0; j < l.length; j++) {
    const vec = { x: j, y: gridSize };

    if (l[j] === '^') {
      guard = { ...vec, dir: '^', path: [] };
    }

    if (l[j] === '#') {
      if (obstacles[vec.x]) obstacles[vec.x].push(vec.y);
      else obstacles[vec.x] = [vec.y];
    }
  }

  gridSize++;
}

function isOutOfBounds({ x, y }) {
  return x < 0 || x >= gridSize || y < 0 || y >= gridSize;
}

function containsObstacle({ x, y }, o) {
  return o[x] && o[x].includes(y);
}

function getNext(g) {
  if (g.dir === '^') return { ...g, y: g.y - 1 };
  if (g.dir === '>') return { ...g, x: g.x + 1 };
  if (g.dir === 'v') return { ...g, y: g.y + 1 };
  if (g.dir === '<') return { ...g, x: g.x - 1 };
}

function detectLoop(g) {
  return g.path.length > 2 * Math.pow(gridSize, 2);
}

function turn(g) {
  if (g.dir === '^') g.dir = '>';
  else if (g.dir === '>') g.dir = 'v';
  else if (g.dir === 'v') g.dir = '<';
  else if (g.dir === '<') g.dir = '^';
}

function recordPath(g) {
  g.path.push({ x: g.x, y: g.y });
}

function move(g, o) {
  recordPath(g);

  const next = getNext(g);

  if (isOutOfBounds(next)) {
    return false;
  }

  if (detectLoop(g)) {
    throw new Error('Loop detected!');
  }

  if (containsObstacle(next, o)) {
    turn(g);
  } else {
    g.x = next.x;
    g.y = next.y;
  }

  return true;
}

function placeObstacle({ x, y }, o) {
  if (x === guard.x && y === guard.y) return;
  if (containsObstacle({ x, y }, o)) return;

  if (o[x]) o[x].push(y);
  else o[x] = [y];

  return true;
}

for (let x = 0; x < gridSize; x++) {
  for (let y = 0; y < gridSize; y++) {
    const g = JSON.parse(JSON.stringify(guard));
    const o = JSON.parse(JSON.stringify(obstacles));

    placeObstacle({ x, y }, o);

    try {
      while (move(g, o)) {
        /**/
      }
    } catch {
      possibleObstacles++;
    }
  }
}

console.log('Obstacle position possibilities:', possibleObstacles);
