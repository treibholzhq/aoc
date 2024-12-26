import { fromFile } from 'gen-readlines';

const bounds = { x: 101, y: 103 };
const qBounds = { x: Math.floor(bounds.x / 2), y: Math.floor(bounds.y / 2) };
const quadrantCount = [0, 0, 0, 0];

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const match = line
    .toString()
    .match(/p=([0-9]+),([0-9]+) v=(-?[0-9]+),(-?[0-9]+)/);

  const [x, y, dx, dy] = [match[1], match[2], match[3], match[4]].map((val) =>
    parseInt(val)
  );

  let pos = { x, y };
  let path = [];

  do {
    pos = { x: pos.x + dx, y: pos.y + dy };
    if (pos.x < 0) pos.x = bounds.x - Math.abs(pos.x);
    else if (pos.x >= bounds.x) pos.x = pos.x - bounds.x;
    if (pos.y < 0) pos.y = bounds.y - Math.abs(pos.y);
    else if (pos.y >= bounds.y) pos.y = pos.y - bounds.y;
    path.push(pos);
  } while (!(pos.x === x && pos.y === y) && path.length < 100);

  const extrapolatedPath = [...path];
  while (extrapolatedPath.length < 100) {
    extrapolatedPath.push(...path);
  }

  const { x: currX, y: currY } = extrapolatedPath[99];

  if (currX < qBounds.x && currY < qBounds.y) {
    quadrantCount[0]++;
  } else if (currX > qBounds.x && currY < qBounds.y) {
    quadrantCount[1]++;
  } else if (currX < qBounds.x && currY > qBounds.y) {
    quadrantCount[2]++;
  } else if (currX > qBounds.x && currY > qBounds.y) {
    quadrantCount[3]++;
  }
}

console.log(
  'Safety factor:',
  quadrantCount.reduce((acc, curr) => acc * curr, 1)
);
