import { join } from 'node:path';

export default function getInputFile(dir, fileName = 'input.txt') {
  return join(dir, fileName).replace('src', 'input');
}
