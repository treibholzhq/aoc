import { fromFile } from 'gen-readlines';

const bounds = { x: 101, y: 103 };
const positions = new Map();

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
    positions.set(path.length, [...(positions.get(path.length) || []), pos]);
  } while (path.length < 10000);
}

for await (const [sec, p] of positions.entries()) {
  const map = new Array(bounds.y);

  for (let y = 0; y < bounds.y; y++) {
    map[y] = new Array(bounds.x).fill(' ');
  }

  for (const { x, y } of p) {
    map[y][x] = '#';
  }

  let found = false;

  for (const row of map) {
    if (row.join('').includes('##########')) {
      found = true;
    }
  }

  if (found) {
    console.log('Second:', sec);
    for (const row of map) {
      console.log(row.join(' '));
    }
    break;
  }
}
