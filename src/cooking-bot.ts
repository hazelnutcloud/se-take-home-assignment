import { Order } from "./order";
import { EventEmitter } from "node:events";

export type GetOrder = () => Order | undefined;

export class CookingBot extends EventEmitter<{ order_complete: [Order] }> {
  #COOKING_TIME_MS = 10_000;
  #currentOrder: Order | undefined;
  #getOrder: GetOrder;
  #cookingTimeout: NodeJS.Timer | undefined;

  constructor(getOrder: GetOrder) {
    super();
    this.#getOrder = getOrder;

    const newOrder = this.#getOrder();

    if (!newOrder) {
      return;
    }

    this.#cook(newOrder);
  }

  get currentOrder() {
    return this.#currentOrder;
  }

  notifyNewOrder() {
    if (this.#currentOrder !== undefined) {
      return false;
    }

    const newOrder = this.#getOrder();
    if (!newOrder) {
      throw new Error("unexpected empty order");
    }

    this.#cook(newOrder);

    return true;
  }

  destroy() {
    if (this.#cookingTimeout) {
      clearTimeout(this.#cookingTimeout);
    }

    return this.#currentOrder;
  }

  #cook(order: Order) {
    this.#currentOrder = order;
    this.#cookingTimeout = setTimeout(
      (() => {
        this.#currentOrder = undefined;

        order.complete();

        this.emit("order_complete", order);

        const nextOrder = this.#getOrder();

        if (!nextOrder) return;

        this.#cook(nextOrder);
      }).bind(this),
      this.#COOKING_TIME_MS
    );
  }
}
