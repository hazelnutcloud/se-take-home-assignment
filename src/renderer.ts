import type { Kitchen } from "./kitchen";
import { type Interface, cursorTo, clearScreenDown } from "node:readline";

export class Renderer {
  #kitchen: Kitchen;
  #rl: Interface;
  #errorMessage?: string;

  constructor(params: { kitchen: Kitchen; rl: Interface }) {
    this.#kitchen = params.kitchen;
    this.#rl = params.rl;

    params.kitchen.on("update", this.render.bind(this));
  }

  render() {
    if (process.env["NODE_ENV"] === "test") {
      return;
    }
    const pendingOrders: { "Pending Orders": number }[] = [];
    const completedOrders: { "Completed Orders": number }[] = [];

    for (const order of this.#kitchen.orders()) {
      if (order.isComplete) {
        completedOrders.push({ "Completed Orders": order.id });
      } else {
        pendingOrders.push({ "Pending Orders": order.id });
      }
    }

    const line = this.#rl.line;
    const cursor = this.#rl.getCursorPos().cols;
    console.clear();

    if (pendingOrders.length > 0) {
      console.table(pendingOrders);
    }

    if (completedOrders.length > 0) {
      console.table(completedOrders);
    }

    console.log("bot count:", this.#kitchen.cookingBots.length);

    console.log(`
Enter a command below and press enter:

o: add new normal order
v: add new VIP order
+: add new cooking bot
-: destroy a cooking bot`);

    if (this.#errorMessage) {
      console.error(this.#errorMessage);
    }
    process.stdout.write("> ");
    process.stdout.write(line);
    cursorTo(process.stdout, cursor);
  }

  displayError(errorMessage: string) {
    this.#errorMessage = errorMessage;
    this.render();
  }

  clearError() {
    this.#errorMessage = undefined;
    this.render();
  }
}
