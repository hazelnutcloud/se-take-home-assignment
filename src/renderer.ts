import { COOKING_TIME_MS, COOKING_TIME_VIP_MS, type Kitchen } from "./kitchen";
import { type Interface, cursorTo, clearScreenDown } from "node:readline";

export class Renderer {
  #kitchen: Kitchen;
  #rl: Interface;
  #errorMessage?: string;

  constructor(params: { kitchen: Kitchen; rl: Interface }) {
    this.#kitchen = params.kitchen;
    this.#rl = params.rl;

    params.kitchen.on("update", this.render.bind(this));
    setInterval(this.render.bind(this), 1000);
  }

  render() {
    if (process.env["NODE_ENV"] === "test") {
      return;
    }
    const pendingOrders: {
      "Pending Orders": number;
      "Time remaining": number | undefined;
    }[] = [];
    const completedOrders: { "Completed Orders": number }[] = [];

    for (const order of this.#kitchen.orders()) {
      if (order.isComplete) {
        completedOrders.push({ "Completed Orders": order.id });
      } else {
        const cookingDuration = order.isProcessByVip
          ? COOKING_TIME_VIP_MS
          : COOKING_TIME_MS;
        const timeRemaining = order.startProcessTime
          ? cookingDuration - (Date.now() - order.startProcessTime)
          : undefined;
        pendingOrders.push({
          "Pending Orders": order.id,
          "Time remaining": timeRemaining
            ? Math.ceil(timeRemaining / 1000)
            : timeRemaining,
        });
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
+v: add new VIP cooking bot
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
