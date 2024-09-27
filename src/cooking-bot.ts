import { COOKING_TIME_MS, COOKING_TIME_VIP_MS } from "./kitchen";
import { Order } from "./order";
import { EventEmitter } from "node:events";

export type GetOrder = () => Order | undefined;

export class CookingBot extends EventEmitter<{ order_complete: [Order] }> {
  #currentOrder: Order | undefined;
  #getOrder: GetOrder;
  #cookingTimeout: NodeJS.Timer | undefined;
  #isVip: boolean;

  constructor(isVip: boolean, getOrder: GetOrder) {
    super();
    this.#getOrder = getOrder;
    this.#isVip = isVip;

    const newOrder = this.#getOrder();

    if (!newOrder) {
      return;
    }

    this.#cook(newOrder);
  }

  get currentOrder() {
    return this.#currentOrder;
  }

  get isVip() {
    return this.#isVip;
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
    order.startProcess(this.#isVip);
    this.#cookingTimeout = setTimeout(
      (() => {
        this.#currentOrder = undefined;

        order.complete();

        this.emit("order_complete", order);

        const nextOrder = this.#getOrder();

        if (!nextOrder) return;

        this.#cook(nextOrder);
      }).bind(this),
      this.#isVip ? COOKING_TIME_VIP_MS : COOKING_TIME_MS
    );
  }
}
