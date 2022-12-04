import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const numOverlappingPairs = input
  .split("\n") // split each elf pair by blank line
  .filter((x) => x) // remove blank lines
  .filter(strPairOverlapsPair).length; // count pairs that fully contain the other

console.log("numOverlappingPairs", numOverlappingPairs);

// --------

function strPairOverlapsPair(pairStr: string): boolean {
  const [pair1Min, pair1Max, pair2Min, pair2Max] = pairStr
    .split(/[,-]/)
    .map((x) => parseInt(x));

  // cases
  // case 1
  // --***----------
  // ---------***---

  // case 2
  // ---------***---
  // --***----------

  // case 3 (overlaps)
  // --***----------
  // ----***--------

  // case 4 (overlaps)
  // ----***--------
  // --***----------

  return (
    // pair 1 starts first, and overlaps with 2 (case 3)
    (pair1Min <= pair2Min && pair2Min <= pair1Max) ||
    // pair 2 starts first, and overlaps with 1 (case 4)
    (pair2Min <= pair1Min && pair1Min <= pair2Max)
  );
}
