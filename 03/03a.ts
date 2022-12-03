import assert from "node:assert";
import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const totalItemScores = input
  .split("\n") // split each rucksack by new line
  .filter((x) => x) // drop empty lines
  .map(findRucksackDuplicateItem) // find the single duplicate between compartments
  .map(itemToScore) // map to score
  .reduce((x, y) => x + y, 0); // sum scores

console.log("Total item scores: ", totalItemScores);

// ---------------------------------

// there's always exactly 1 duplicate 🤷‍♂️
function findRucksackDuplicateItem(rucksack: string): string {
  const halfLength = rucksack.length / 2;
  const compartment1 = rucksack.substring(0, halfLength).split("");
  const compartment2 = rucksack.substring(halfLength).split("");

  const duplicate = compartment1.find((x) => compartment2.includes(x));
  assert(duplicate);

  return duplicate;
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
