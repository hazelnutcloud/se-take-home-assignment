export class Queue<Item> implements Iterable<Item> {
  #items: Item[];

  constructor() {
    this.#items = [];
  }

  *[Symbol.iterator](): Iterator<Item> {
    for (const item of this.#items) {
      yield item;
    }
  }

  push(item: Item) {
    return this.#items.push(item);
  }

  priorityQueue(item: Item) {
    return this.#items.unshift(item);
  }

  dequeue() {
    return this.#items.shift();
  }
}
