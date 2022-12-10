import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const trees = input
  .split("\n") // split each row
  .filter((x) => x) // remove empties
  .map((treesRow) => treesRow.split("").map((x) => parseInt(x, 10)));

// inclusive of "from"
// exclusive of "to"
function range(from: number, to: number): Array<number> {
  const direction = from < to ? 1 : -1;

  const nums = [];
  for (let i = from; i !== to; i += direction) {
    nums.push(i);
  }

  return nums;
}

function treeIsVisibleFromOutside(treeX: number, treeY: number): boolean {
  const treeHeight = trees[treeY][treeX];

  return (
    // search from top side to tree
    range(0, treeY).every((y) => trees[y][treeX] < treeHeight) ||
    // search from right side to tree
    range(trees[treeY].length - 1, treeX).every(
      (x) => trees[treeY][x] < treeHeight
    ) ||
    // search from bottom side to tree
    range(trees.length - 1, treeY).every((y) => trees[y][treeX] < treeHeight) ||
    // search from left side to tree
    range(0, treeX).every((x) => trees[treeY][x] < treeHeight)
  );
}

const numVisibleTrees = trees
  .flatMap((row, y) => row.map((height, x) => treeIsVisibleFromOutside(x, y)))
  .filter((x) => x).length;
console.log("numVisibleTrees", numVisibleTrees);
