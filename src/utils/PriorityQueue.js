export default class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  push(item) {
    this.queue.push(item);
    this.queue.sort((a, b) => b[0] - a[0]);
    return this;
  }

  pop() {
    return this.queue.pop();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}
