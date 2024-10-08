import { CookingBot } from "./cooking-bot";
import { Order } from "./order";
import { Queue } from "./queue";
import { Stack } from "./stack";
import { EventEmitter } from "node:events";

export const COOKING_TIME_MS = 10_000;
export const COOKING_TIME_VIP_MS = 5_000;

export class Kitchen extends EventEmitter<{ update: [] }> {
  #cookingBots: Stack<CookingBot> = new Stack();
  #normalOrders: Queue<Order> = new Queue();
  #vipOrders: Queue<Order> = new Queue();
  #completedOrders: Order[] = [];
  #ordersCount: number = 0;

  addNewOrder(params: { vip: boolean }) {
    const newOrder = new Order({ id: this.#ordersCount++, isVip: params.vip });

    this.#addOrder(newOrder);
  }

  incrBot(isVip: boolean) {
    const newBot = new CookingBot(
      isVip,
      (() => {
        const vipOrder = this.#vipOrders.dequeue();

        if (vipOrder) {
          return vipOrder;
        }

        return this.#normalOrders.dequeue();
      }).bind(this)
    );

    newBot.on("order_complete", (order: Order) => {
      this.#completedOrders.push(order);

      this.emit("update");
    });

    this.#cookingBots.push(newBot);

    this.emit("update");
  }

  decrBot() {
    const newestBot = this.#cookingBots.pop();

    if (!newestBot) return;

    const orderInProcess = newestBot.destroy();
    if (orderInProcess) {
      this.#addOrder(orderInProcess, true);
    }

    this.emit("update");
  }

  *orders() {
    for (const bot of this.#cookingBots) {
      if (bot.currentOrder) yield bot.currentOrder;
    }

    for (const order of this.#vipOrders) {
      yield order;
    }

    for (const order of this.#normalOrders) {
      yield order;
    }

    for (const order of this.#completedOrders) {
      yield order;
    }
  }

  get cookingBots() {
    return this.#cookingBots;
  }

  get completedOrders() {
    return this.#completedOrders;
  }

  #addOrder(order: Order, priority = false) {
    if (order.isVip) {
      this.#vipOrders.push(order, priority);
    } else {
      this.#normalOrders.push(order, priority);
    }

    const vipBots = this.#cookingBots.filter((bot) => bot.isVip);
    const normalBots = this.#cookingBots.filter((bot) => !bot.isVip);

    let hasTakenOrder = false;

    for (const bot of vipBots) {
      const tookOrder = bot.notifyNewOrder();

      if (tookOrder) {
        hasTakenOrder = true;
        break;
      }
    }

    if (!hasTakenOrder) {
      for (const bot of normalBots) {
        const tookOrder = bot.notifyNewOrder();

        if (tookOrder) {
          break;
        }
      }
    }

    this.emit("update");
  }
}
