import { fromFile } from 'gen-readlines';
import PriorityQueue from '../../utils/PriorityQueue';
import { DIRECTIONS } from '../../utils/constants';

function solve(gridSize = 70, numBytes = 1024) {
  const toKey = ([x, y]) => `${x},${y}`;

  const bytes = [...fromFile(`${import.meta.dirname}/input.txt`)]
    .map(String)
    .slice(0, numBytes);

  const grid = new Array(gridSize + 1)
    .fill(new Array(gridSize + 1).fill(''))
    .reduce(
      (g, r, y) =>
        r.forEach(
          (_, x) =>
            (x === 0 && y === 0 && (g[toKey([x, y])] = 'S')) ||
            (x === gridSize && y === gridSize && (g[toKey([x, y])] = 'E')) ||
            (bytes.indexOf(toKey([x, y])) === -1 && (g[toKey([x, y])] = '.'))
        ) || g,
      {}
    );

  const start = Object.entries(grid)
    .find(([, v]) => v === 'S')[0]
    .split(',')
    .map(Number);

  const end = Object.entries(grid)
    .find(([, v]) => v === 'E')[0]
    .split(',')
    .map(Number);

  const manhattanDistance = ([x1, y1], [x2, y2]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2);

  const reconstructPath = (_cameFrom, _current) => {
    const totalPath = [_current];
    while (_cameFrom.has(_current)) {
      _current = _cameFrom.get(_current);
      totalPath.push(_current);
    }
    return totalPath.reverse();
  };

  const openSet = new PriorityQueue()
    // [fScore, key, position]
    .push([manhattanDistance(start, end), toKey(start), start]);
  const gScore = new Map([[toKey(start), 0]]);
  const cameFrom = new Map();

  while (!openSet.isEmpty()) {
    const [, key, pos] = openSet.pop();

    if (grid[key] === 'E') {
      return reconstructPath(cameFrom, key);
    }

    for (const [dx, dy] of DIRECTIONS) {
      const [x, y] = pos;
      const newPos = [x + dx, y + dy];
      const newKey = toKey(newPos);

      if (!grid[toKey(newPos)]) continue;

      const tentativeGScore = gScore.get(key) + 1;

      if (tentativeGScore < (gScore.get(newKey) ?? Infinity)) {
        cameFrom.set(newKey, key);
        gScore.set(newKey, tentativeGScore);

        if (!openSet.has(newKey)) {
          openSet.push([
            tentativeGScore + manhattanDistance(newPos, end),
            newKey,
            newPos,
          ]);
        }
      }
    }
  }

  throw new Error(`No path from ${toKey(start)} to ${toKey(end)}`);
}

const path = solve();
console.log('Minimum number of steps:', path.length - 1);
