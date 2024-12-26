import { fromFile } from 'gen-readlines';
import PriorityQueue from '../../utils/PriorityQueue';

export default function solve() {
  const toKey = ([x, y]) => `${x},${y}`;

  const grid = [...fromFile(`${import.meta.dirname}/input.txt`)]
    .map((l) => l.toString().split(''))
    .reduce(
      (g, r, y) =>
        r.forEach((c, x) => c !== '#' && (g[toKey([x, y])] = c)) || g,
      {}
    );

  const start = Object.entries(grid)
    .find(([, v]) => v === 'S')[0]
    .split(',')
    .map(Number);

  const todo = new PriorityQueue()
    // [score, key, position, direction, path]
    .push([0, toKey(start), start, [1, 0], [start]]);
  const visited = new Set();
  const distances = new Map();
  let lowestScore = Infinity;

  while (!todo.isEmpty()) {
    const [score, key, pos, dir, path] = todo.pop();

    const distKey = `${key},${toKey(dir)}`;
    if (score > (distances.get(distKey) ?? Infinity)) continue;
    distances.set(distKey, score);

    if (grid[key] === 'E' && score <= lowestScore) {
      path.forEach((p) => visited.add(toKey(p)));
      lowestScore = score;
    }

    for (const [turn, cost] of [
      [0, 1], // no turn (cost = 1)
      [1, 1001], // turn 90° clockwise (cost = 1001)
      [-1, 1001], // turn 90° counterclockwise (cost = 1001)
    ]) {
      // 2d vector rotation
      const [dx, dy] = dir;
      const newDir =
        turn === 1 ? [dy, -dx] : turn === -1 ? [-dy, dx] : [dx, dy];

      const [x, y] = pos;
      const newPos = [x + newDir[0], y + newDir[1]];

      if (!grid[toKey(newPos)]) continue;

      todo.push([
        score + cost,
        toKey(newPos),
        newPos,
        newDir,
        [...path, newPos],
      ]);
    }
  }

  return [lowestScore, visited.size];
}
