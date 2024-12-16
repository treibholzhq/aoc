import { fromFile } from 'gen-readlines';

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();

  const disk = [];
  const compacted = [];
  let fileId = 0;

  for (let i = 0, j = i + 1; i <= l.length; i += 2, j += 2) {
    let [occupiedBlocks, freeBlocks] = [
      parseInt(l[i] ?? 0),
      parseInt(l[j] ?? 0),
    ];

    disk.push(...new Array(occupiedBlocks).fill(fileId));
    disk.push(...new Array(freeBlocks).fill('.'));

    fileId++;
  }

  for (
    let cursor = disk.length - 1, threshold = cursor;
    cursor >= 0;
    cursor--, threshold = cursor
  ) {
    if (disk[cursor] === '.') {
      continue;
    }

    const freeBlockIndex = disk.indexOf('.');

    if (freeBlockIndex >= threshold) {
      compacted.push(...disk.slice(0, freeBlockIndex));
      break;
    }

    disk[freeBlockIndex] = disk[cursor];
    disk[cursor] = '.';
  }

  const checksum = compacted.reduce(
    (acc, curr, i) => BigInt(acc) + BigInt(i) * BigInt(curr),
    0
  );

  console.log('Filesystem checksum:', checksum.toString());
}
