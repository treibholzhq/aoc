export default class PriorityQueue {
  constructor() {
    this.queue = [];
    this.keys = new Map();
  }

  push(item) {
    this.queue.push(item);
    this.queue.sort((a, b) => b[0] - a[0]);
    this.keys.set(item[1], this.queue.indexOf(item));
    return this;
  }

  pop() {
    const i = this.queue.pop();
    this.keys.delete(i[1]);
    return i;
  }

  has(key) {
    return this.keys.has(key);
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}
