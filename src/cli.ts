import { createInterface } from "node:readline";
import { Kitchen } from "./kitchen";
import { Renderer } from "./renderer";

// Run "bun start to run the CLI, and bun test to run the tests"

const kitchen = new Kitchen();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});
rl.on("line", (input) => handleInput(kitchen, input));

const renderer = new Renderer({ kitchen, rl });
renderer.render();

export function handleInput(kitchen: Kitchen, rawInput: string) {
  const input = rawInput.toLowerCase();

  if (input === "o") {
    kitchen.addNewOrder({ vip: false });
  } else if (input === "v") {
    kitchen.addNewOrder({ vip: true });
  } else if (input === "+v") {
    kitchen.incrBot(true);
  } else if (input === "+") {
    kitchen.incrBot(false);
  } else if (input === "-") {
    kitchen.decrBot();
  } else {
    renderer.displayError(`Unknown command: ${input}`);
    return;
  }

  renderer.clearError();
}
