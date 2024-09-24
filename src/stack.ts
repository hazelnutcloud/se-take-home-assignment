export class Stack<Item> implements Iterable<Item> {
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

  pop() {
    return this.#items.pop();
  }

  get length() {
    return this.#items.length;
  }
}
