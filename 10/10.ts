import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

type Instruction =
  | {
      type: "noop";
    }
  | {
      type: "addx";
      value: number;
    };

// parse instructions
const instructions: Instruction[] = input
  .split("\n") // split each elf by blank line
  .filter((x) => x) // remove blank lines
  .map(
    (instructionString) =>
      ({
        type: instructionString.split(" ")[0],
        value: parseInt(instructionString.split(" ")[1], 10) || undefined,
      } as Instruction)
  );

// store the value of our register at every clock step
const registerValues: number[] = [1]; // during cycle 1 the register value is 1
for (const instruction of instructions) {
  const currentRegisterValue = registerValues[registerValues.length - 1];

  switch (instruction.type) {
    case "noop":
      registerValues.push(currentRegisterValue); // do nothing for 1 cycle
      break;
    case "addx":
      registerValues.push(currentRegisterValue); // 1 cycle to compute
      registerValues.push(currentRegisterValue + instruction.value); // 1 cycle to update
      break;
  }
}

// sum our important cycles
const cyclesSum = [20, 60, 100, 140, 180, 220]
  // go back to see what the value was DURING this cycle (0 indexed)
  .map((cycle) => cycle * registerValues[cycle - 1]) // get signal strength for cycle
  .reduce((val, signalStrength) => val + signalStrength, 0); // add strengths together

console.log("cyclesSum", cyclesSum);

// part 2
for (let y = 0; y < 6; y++) {
  for (let x = 0; x < 40; x++) {
    const cycle = x + y * 40 + 1;
    const spriteXCentre = registerValues[cycle - 1];
    const spriteXStart = spriteXCentre - 1;
    const spriteXEnd = spriteXCentre + 1;

    const spriteIsVisible = spriteXStart <= x && x <= spriteXEnd;
    process.stdout.write(spriteIsVisible ? "#" : ".");
  }
  process.stdout.write("\n");
}
