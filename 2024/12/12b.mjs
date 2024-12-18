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
      corners: 0,
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

function calculateCorners(region) {
  let outsideCorners = 0;
  let insideCorners = 0;

  for (const plant of region) {
    plant.corners = 0;

    const { regionId, n, s, e, w } = plant;

    if (
      n?.regionId !== regionId &&
      w?.regionId !== regionId &&
      n?.w?.regionId !== regionId
    ) {
      outsideCorners++;
      plant.corners++;
    }
    if (
      n?.regionId !== regionId &&
      e?.regionId !== regionId &&
      n?.e?.regionId !== regionId
    ) {
      outsideCorners++;
      plant.corners++;
    }
    if (
      s?.regionId !== regionId &&
      w?.regionId !== regionId &&
      s?.w?.regionId !== regionId
    ) {
      outsideCorners++;
      plant.corners++;
    }
    if (
      s?.regionId !== regionId &&
      e?.regionId !== regionId &&
      s?.e?.regionId !== regionId
    ) {
      outsideCorners++;
      plant.corners++;
    }
  }

  const { regionId } = region[0];

  for (const plant of plants) {
    const { regionId: r, n, s, e, w } = plant;

    if (r === regionId) continue;

    if (n?.regionId === regionId && w?.regionId === regionId) {
      insideCorners++;
    }
    if (n?.regionId === regionId && e?.regionId === regionId) {
      insideCorners++;
    }
    if (s?.regionId === regionId && w?.regionId === regionId) {
      insideCorners++;
    }
    if (s?.regionId === regionId && e?.regionId === regionId) {
      insideCorners++;
    }
  }

  return outsideCorners + insideCorners;
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
  prices.set(plant.regionId, region.length * calculateCorners(region));
}

console.log(
  'Total price:',
  [...prices.values()].reduce((acc, curr) => acc + curr, 0)
);
