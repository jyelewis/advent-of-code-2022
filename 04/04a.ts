import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const numOverlappingPairs = input
  .split("\n") // split each elf pair by blank line
  .filter((x) => x) // remove blank lines
  .filter(strPairContainsPair).length; // count pairs that fully contain the other

console.log("numOverlappingPairs", numOverlappingPairs);

// --------

function strPairContainsPair(pairStr: string): boolean {
  const [pair1Min, pair1Max, pair2Min, pair2Max] = pairStr
    .split(/[,-]/)
    .map((x) => parseInt(x));

  // check twice, does p1 contain p2, does p2 contain p1
  return (
    (pair1Min <= pair2Min && pair1Max >= pair2Max) ||
    (pair2Min <= pair1Min && pair2Max >= pair1Max)
  );
}
