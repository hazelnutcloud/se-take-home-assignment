import type { Kitchen } from "./kitchen";

export class Renderer {
  #kitchen: Kitchen;
  #errorMessage?: string;

  constructor(kitchen: Kitchen) {
    this.#kitchen = kitchen;

    kitchen.on("update", this.render.bind(this));
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

    process.stdout.write("\x1b[2J\x1b[H");

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
