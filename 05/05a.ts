import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const [stacksStr, instructionsStr] = input.split("\n\n");
const instructions = instructionsStr.split("\n").filter((x) => x);

// parse starting stacks
const stacks = rowsToColumns(
  stacksStr
    .split("\n") // split each row of the stack
    .reverse() // start from the bottom of the stack
    .slice(1) // skip the row containing numbers
    .map(stackRowToItems) // convert this string row into an array of items ("[Z]     [P]" -> ['', 'Z', '', 'P'])
);

// follow instructions
for (const instruction of instructions) {
  // "move 3 from 1 to 3"
  const splitInstruction = instruction.split(" ");
  const itemsToMove = parseInt(splitInstruction[1], 10);
  const fromStack = parseInt(splitInstruction[3], 10);
  const toStack = parseInt(splitInstruction[5], 10);

  // follow instructions in sequence, mutating the stacks as we go
  for (let i = 0; i < itemsToMove; i++) {
    const item = stacks[fromStack].pop()!; // take item from the top of the stack
    stacks[toStack].push(item); // place item on desired stack
  }
}

const topOfEachStack = stacks.map((stack) => stack[stack.length - 1]).join("");
console.log("topOfEachStack", topOfEachStack);

// convert this string row into an array of items ("[Z]     [P]" -> ['', 'Z', '', 'P'])
function stackRowToItems(stackRow: string): string[] {
  // stackRow: [Z] [M] [P]
  // walk across the string, 4 chars at a time looking for an item (may be an empty space)

  const items: string[] = [""]; // skip item 0 so we can index things from 1 from here on

  for (let cursor = 0; cursor <= stackRow.length; cursor += 4) {
    let stackItem = stackRow.slice(cursor, cursor + 4).trim(); // extract this item
    items.push(stackItem.slice(1, 2)); // remove the square brackets to get just the letter
  }

  return items;
}

// we parse out the input by row
// reformat this so we have an array for each column (shipping container stack)
// from the bottom up, so we can shuffle things around
function rowsToColumns(rows: string[][]): string[][] {
  const numColumns = Math.max(...rows.map((x) => x.length));
  const columns: string[][] = new Array(numColumns).fill(null).map(() => []);

  rows.forEach((row) =>
    row.forEach((item, columnIndex) => {
      if (item !== "") {
        columns[columnIndex].push(item);
      }
    })
  );

  return columns;
}
