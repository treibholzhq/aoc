import { fromFile } from 'gen-readlines';

for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();

  const disk = [];
  const files = [];
  const freeBlockSizeMap = new Map();
  let fileId = 0;

  for (let i = 0, j = i + 1; i <= l.length; i += 2, j += 2) {
    let [occupiedBlocks, freeBlocks] = [
      parseInt(l[i] ?? 0),
      parseInt(l[j] ?? 0),
    ];

    files.unshift([occupiedBlocks, disk.length]);

    disk.push(...new Array(occupiedBlocks).fill(fileId));
    disk.push(...new Array(freeBlocks).fill('.'));

    if (freeBlocks) {
      freeBlockSizeMap.set(disk.length - freeBlocks, freeBlocks);
    }

    fileId++;
  }

  files.forEach(([fileSize, filePos]) => {
    let [freeBlockIndex, freeBlockSize] = [undefined, undefined];

    for (const key of new Float64Array([...freeBlockSizeMap.keys()]).sort()) {
      const val = freeBlockSizeMap.get(key);
      if (val >= fileSize) {
        freeBlockIndex = key;
        freeBlockSize = val;
        break;
      }
    }

    if (!freeBlockIndex) {
      return;
    }

    if (filePos < freeBlockIndex) {
      return;
    }

    freeBlockSizeMap.delete(freeBlockIndex);

    if (freeBlockSize > fileSize) {
      freeBlockSizeMap.set(freeBlockIndex + fileSize, freeBlockSize - fileSize);
    }

    disk.splice(
      filePos,
      fileSize,
      ...disk.splice(
        freeBlockIndex,
        fileSize,
        ...disk.slice(filePos, filePos + fileSize)
      )
    );
  });

  const checksum = disk.reduce(
    (acc, curr, i) =>
      curr !== '.' ? BigInt(acc) + BigInt(i) * BigInt(curr) : BigInt(acc),
    0
  );

  console.log('Filesystem checksum:', checksum.toString());
}
