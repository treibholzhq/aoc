import { fromFile } from 'gen-readlines';

const Direction = Object.freeze({
  up: '^',
  down: 'v',
  right: '>',
  left: '<',
});

const wall = { key: '#' };
const box = { key: 'O' };
const space = { key: '.' };
const robot = { key: '@' };

const map = [];
const moves = [];
const boxes = [];

let y = 0;
for (const line of fromFile(`${import.meta.dirname}/input.txt`)) {
  const l = line.toString();
  if (l.startsWith('#')) {
    const row = [];
    for (let x = 0, key = l[x]; x < l.length; key = l[++x]) {
      if (key === wall.key) {
        row.push({ ...wall, x, y });
      } else if (key === box.key) {
        const b = { ...box, x, y };
        row.push(b);
        boxes.push(b);
      } else if (key === robot.key) {
        robot.x = x;
        robot.y = y;
        row.push(robot);
      } else {
        row.push({ ...space, x, y });
      }
    }
    map.push(row);
    y++;
  } else if (Object.values(Direction).includes(l[0])) {
    moves.push(...l.split(''));
  }
}

function updateNeighbors(objects) {
  objects = Array.isArray(objects) ? objects : [objects];

  for (const obj of objects) {
    const { x, y } = obj;

    if (y - 1 >= 0) {
      obj[Direction.up] = map[y - 1][x];
    }
    if (y + 1 < map.length) {
      obj[Direction.down] = map[y + 1][x];
    }
    if (x + 1 < map[0].length) {
      obj[Direction.right] = map[y][x + 1];
    }
    if (x - 1 >= 0) {
      obj[Direction.left] = map[y][x - 1];
    }
  }
}

function isWallAhead(obj, direction) {
  return obj[direction]?.key === wall.key;
}

function moveObj(obj, x, y) {
  obj.x = x;
  obj.y = y;
  map[y][x] = obj;
}

function moveIntoFreeSpace(obj, direction) {
  const neighbor = obj[direction];

  if (neighbor?.key !== space.key) {
    return false;
  }

  const { x: x1, y: y1 } = obj;
  const { x: x2, y: y2 } = neighbor;

  moveObj(obj, x2, y2);
  moveObj(neighbor, x1, y1);

  return true;
}

function pushBoxes(robot, direction) {
  let boxesToPush = [];
  let b = robot[direction];

  while (b.key === box.key) {
    if (isWallAhead(b, direction)) {
      boxesToPush = [];
      break;
    }
    boxesToPush.push(b);
    b = b[direction];
  }

  if (!boxesToPush.length) {
    return false;
  }

  boxesToPush.reverse().forEach((box) => {
    const { x, y } = box;

    if (direction === Direction.up) {
      moveObj(box, x, y - 1);
    } else if (direction === Direction.down) {
      moveObj(box, x, y + 1);
    } else if (direction === Direction.right) {
      moveObj(box, x + 1, y);
    } else if (direction === Direction.left) {
      moveObj(box, x - 1, y);
    }

    moveObj({ ...space }, x, y);
  });

  return true;
}

function move(direction) {
  updateNeighbors(robot);
  updateNeighbors(boxes);

  if (isWallAhead(robot, direction)) {
    return;
  }

  if (moveIntoFreeSpace(robot, direction)) {
    return;
  }

  if (pushBoxes(robot, direction)) {
    updateNeighbors(robot);
    moveIntoFreeSpace(robot, direction);
  }
}

moves.forEach(move);

console.log(
  'Sum of GPS coordinates:',
  boxes.reduce((acc, { x, y }) => acc + (100 * y + x), 0)
);
