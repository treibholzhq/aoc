import { fromFile } from 'gen-readlines';

const plants = [];
const regions = new Map();
const prices = new Map();

let y = 0;
for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString().split('');

  for (let x = 0; x < l.length; x++) {
    plants.push({
      key: l[x],
      pos: [x, y],
      regionId: null,
      n: null,
      s: null,
      e: null,
      w: null,
    });
  }

  y++;
}

function isSelf(plant, other) {
  const [[x1, y1], [x2, y2]] = [plant.pos, other.pos];
  return x1 === x2 && y1 === y2;
}

function isAdjacent([x1, y1], [x2, y2]) {
  if (y2 + 1 === y1 && x2 === x1) return 'n';
  if (y2 - 1 === y1 && x2 === x1) return 's';
  if (x2 - 1 === x1 && y2 === y1) return 'e';
  if (x2 + 1 === x1 && y2 === y1) return 'w';
  return false;
}

let regionIdCounter = 0;
function setRegion(plant, regionId) {
  if (plant.regionId !== null) return;

  if (regionId === null) {
    plant.regionId = regionIdCounter;
    regionIdCounter++;
  } else {
    plant.regionId = regionId;
  }

  const { key, regionId: r, n, s, e, w } = plant;

  for (const d of [n, s, e, w]) {
    if (d && d.key === key) setRegion(d, r);
  }
}

function calculatePerimeter(region) {
  let perimeter = 0;

  for (const plant of region) {
    let localPerimeter = 4;
    for (const other of region) {
      if (isSelf(plant, other)) continue;
      if (isAdjacent(plant.pos, other.pos)) {
        localPerimeter--;
      }
    }
    perimeter += localPerimeter;
  }

  return perimeter;
}

for (const plant of plants) {
  for (const other of plants) {
    if (isSelf(plant, other)) continue;

    const adj = isAdjacent(plant.pos, other.pos);
    if (adj) {
      plant[adj] = other;
    }
  }
}

for (const plant of plants) {
  setRegion(plant, null);

  const region = [...(regions.get(plant.regionId) || []), plant];
  regions.set(plant.regionId, region);
  prices.set(plant.regionId, region.length * calculatePerimeter(region));
}

console.log(
  'Total price:',
  [...prices.values()].reduce((acc, curr) => acc + curr, 0)
);
