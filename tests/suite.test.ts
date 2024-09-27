import { test, describe, expect } from "bun:test";
import { Kitchen } from "../src/kitchen";
import { handleInput } from "../src/cli";

describe("Kitchen", () => {
  test("New Normal Order", () => {
    const kitchen = new Kitchen();

    handleInput(kitchen, "o");

    const orders = Array.from(kitchen.orders());

    expect(orders).toBeArrayOfSize(1);
    expect(orders[0].isComplete).toBe(false);
  });

  test("New VIP Order", () => {
    const kitchen = new Kitchen();

    handleInput(kitchen, "o");
    handleInput(kitchen, "v");

    const orders = Array.from(kitchen.orders());

    expect(orders).toBeArrayOfSize(2);
    expect(orders[0].isComplete).toBe(false);
    expect(orders[0].isVip).toBe(true);
    expect(orders[1].isComplete).toBe(false);
    expect(orders[1].isVip).toBe(false);
  });

  test("Unique And Increasing Order ID", () => {
    const kitchen = new Kitchen();

    handleInput(kitchen, "o");
    handleInput(kitchen, "o");

    const orders = Array.from(kitchen.orders());
    expect(orders[0].id).toBe(0);
    expect(orders[1].id).toBe(1);
  });

  test.skip(
    "Increment Bot",
    async () => {
      const kitchen = new Kitchen();

      handleInput(kitchen, "o");
      handleInput(kitchen, "v");
      handleInput(kitchen, "+");

      expect(kitchen.cookingBots.length).toBe(1);

      console.log("waiting for bot to finish cooking");
      await Bun.sleep(10_000);

      expect(kitchen.completedOrders.length).toBe(1);
      expect(kitchen.completedOrders[0].id).toBe(1);

      console.log("waiting for bot to finish cooking");
      await Bun.sleep(10_000);

      expect(kitchen.completedOrders.length).toBe(2);
      expect(kitchen.completedOrders[1].id).toBe(0);
    },
    { timeout: 25_000 }
  );

  test(
    "Increment VIP Bot",
    async () => {
      const kitchen = new Kitchen();

      handleInput(kitchen, "o");
      handleInput(kitchen, "+v");

      expect(kitchen.cookingBots.length).toBe(1);

      console.log("waiting for bot to finish cooking");
      await Bun.sleep(5_000);

      expect(kitchen.completedOrders.length).toBe(1);
      expect(kitchen.completedOrders[0].id).toBe(0);
    },
    { timeout: 10_000 }
  );

  test("Idling Bot", () => {
    const kitchen = new Kitchen();

    handleInput(kitchen, "+");

    let bots = Array.from(kitchen.cookingBots);

    expect(bots.length).toBe(1);
    expect(bots[0].currentOrder).toBeUndefined();

    handleInput(kitchen, "o");

    bots = Array.from(kitchen.cookingBots);

    expect(bots[0].currentOrder).toBeDefined();
  });

  test("Bot destroy", () => {
    const kitchen = new Kitchen();

    handleInput(kitchen, "o");
    handleInput(kitchen, "+");
    handleInput(kitchen, "-");

    const bots = Array.from(kitchen.cookingBots);

    expect(bots.length).toBe(0);

    const orders = Array.from(kitchen.orders());

    expect(orders.length).toBe(1);
    expect(orders[0].isComplete).toBe(false);
  });
});

/**
 *
 */
