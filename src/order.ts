export class Order {
  #id: number;
  #isVip: boolean;
  #isComplete = false;

  constructor(params: { id: number; isVip: boolean }) {
    this.#id = params.id;
    this.#isVip = params.isVip;
  }

  get id() {
    return this.#id;
  }

  get isVip() {
    return this.#isVip;
  }

  get isComplete() {
    return this.#isComplete;
  }

  complete() {
    this.#isComplete = true;
  }
}
