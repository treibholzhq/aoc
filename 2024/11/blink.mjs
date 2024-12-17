import { fromFile } from 'gen-readlines';

export default function blink(n) {
  const stones = fromFile(`${import.meta.dirname}/input.txt`)
    .next()
    .value.toString()
    .split(' ')
    .map((c) => parseInt(c));

  let cache = new Map(stones.map((s) => [s, 1]));

  function updateCache(_cache, _key, _count) {
    _cache.set(_key, (_cache.get(_key) || 0) + _count);
  }

  for (let i = 0; i < n; i++) {
    const tmpCache = new Map();

    for (const [stone, count] of cache.entries()) {
      const str = stone.toString();
      if (stone === 0) {
        updateCache(tmpCache, 1, count);
      } else if (str.length % 2 === 0) {
        const first = parseInt(str.slice(0, str.length / 2));
        const second = parseInt(str.slice(str.length / 2, str.length));
        updateCache(tmpCache, first, count);
        updateCache(tmpCache, second, count);
      } else {
        updateCache(tmpCache, stone * 2024, count);
      }
    }

    cache = tmpCache;
  }

  return [...cache.values()].reduce((acc, curr) => acc + curr, 0);
}
