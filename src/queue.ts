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

  push(item: Item, priority = false) {
    if (priority) {
      return this.#items.unshift(item);
    }
    return this.#items.push(item);
  }

  dequeue() {
    return this.#items.shift();
  }
}
