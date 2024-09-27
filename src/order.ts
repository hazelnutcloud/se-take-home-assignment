export class Order {
  #id: number;
  #isVip: boolean;
  #isComplete = false;
  #startProcessTime: number | undefined;
  #isProcessedByVip = false;

  constructor(params: { id: number; isVip: boolean }) {
    this.#id = params.id;
    this.#isVip = params.isVip;
  }

  startProcess(byVipBot: boolean) {
    this.#startProcessTime = Date.now();
    this.#isProcessedByVip = byVipBot;
  }

  get startProcessTime() {
    return this.#startProcessTime;
  }

  get id() {
    return this.#id;
  }

  get isVip() {
    return this.#isVip;
  }

  get isProcessByVip() {
    return this.#isProcessedByVip;
  }

  get isComplete() {
    return this.#isComplete;
  }

  complete() {
    this.#isComplete = true;
  }
}
