import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const trees = input
  .split("\n") // split each row
  .filter((x) => x) // remove empties
  .map((treesRow) => treesRow.split("").map((x) => parseInt(x, 10)));

// exclusive of "from"
// inclusive of "to"
function countRangeUntil(
  from: number,
  to: number,
  untilFn: (val: number) => boolean
): number {
  const direction = from < to ? 1 : -1;

  let count = 0;
  for (let i = from + direction; i !== to + direction; i += direction) {
    count++;

    // check after we increment,
    // the tree blocking our view is also included in the score
    if (untilFn(i)) {
      break;
    }
  }

  return count;
}

function treeScenicScore(treeX: number, treeY: number): number {
  const treeHeight = trees[treeY][treeX];

  const topScenicScore = countRangeUntil(
    treeY,
    0,
    (y) => trees[y][treeX] >= treeHeight
  );

  const rightScenicScore = countRangeUntil(
    treeX,
    trees[treeY].length - 1,
    (x) => trees[treeY][x] >= treeHeight
  );

  const bottomScenicScore = countRangeUntil(
    treeY,
    trees.length - 1,
    (y) => trees[y][treeX] >= treeHeight
  );

  const leftScenicScore = countRangeUntil(
    treeX,
    0,
    (x) => trees[treeY][x] >= treeHeight
  );

  return (
    topScenicScore * rightScenicScore * bottomScenicScore * leftScenicScore
  );
}

const scenicScores = trees.flatMap((row, y) =>
  row.map((height, x) => treeScenicScore(x, y))
);

const highestScenicScore = Math.max(...scenicScores);
console.log("highestScenicScore", highestScenicScore);
