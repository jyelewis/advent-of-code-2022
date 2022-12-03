import assert from "node:assert";
import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const totalBadgeScores = groupItems(
  input
    .split("\n") // split each rucksack by new line
    .filter((x) => x), // drop empty lines
  3
) // group by 3
  .map(findItemInEveryRucksack) // find distinct item (must be their badge type)
  .map(itemToScore) // letters to score
  .reduce((a, b) => a + b, 0); // sum scores

console.log("Total badge scores: ", totalBadgeScores);

// ---------------------------------

// splits an array into groups
// groupItems([1, 2, 3, 4, 5, 6], 3) = [[1, 2, 3], [4, 5, 6]]
function groupItems<T>(items: T[], groupSize: number): T[][] {
  const groups: T[][] = [];
  assert(items.length % groupSize === 0);

  let currentGroup: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (i % groupSize === 0 && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(items[i]);
  }

  groups.push(currentGroup);

  return groups;
}

// there's always exactly 1 shared item 🤷‍♂️
function findItemInEveryRucksack(rucksacks: string[]): string {
  assert(rucksacks.length === 3);

  const r1 = rucksacks[0].split("");
  const r2 = rucksacks[1].split("");
  const r3 = rucksacks[2].split("");

  const sharedItems = r1
    .filter((x) => r2.includes(x))
    .filter((x) => r3.includes(x));

  assert(sharedItems.length);
  return sharedItems[0];
}

function itemToScore(item: string): number {
  assert(item.length === 1);
  const charCode = item.charCodeAt(0);

  // a-z: 1-26
  if (charCode > 96) {
    return charCode - 96;
  }

  // A-Z: 27-52
  return charCode - 38;
}
