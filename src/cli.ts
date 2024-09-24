import { createInterface } from "node:readline";
import { Kitchen } from "./kitchen";
import { Renderer } from "./view";

const kitchen = new Kitchen();
const renderer = new Renderer(kitchen);
renderer.render();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});
rl.on("line", (input) => handleInput(kitchen, input));

export function handleInput(kitchen: Kitchen, rawInput: string) {
  const input = rawInput.toLowerCase();

  if (input === "o") {
    kitchen.addNewOrder({ vip: false });
  } else if (input === "v") {
    kitchen.addNewOrder({ vip: true });
  } else if (input === "+") {
    kitchen.incrBot();
  } else if (input === "-") {
    kitchen.decrBot();
  } else {
    renderer.displayError(`Unknown command: ${input}`);
    return;
  }

  renderer.clearError();
}
