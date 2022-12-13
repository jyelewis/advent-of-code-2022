import * as fs from "fs";
import assert from "node:assert";

const NOT_SURE = Symbol("NOT_SURE");
type Packet = number | Array<Packet>;

// parse input
const pairsOfPackets: Array<[Packet, Packet]> = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n\n") // split each pair by blank line
  .filter((x) => x) // remove empties
  .map(
    (pairString) =>
      pairString // parse out each string of lines into an array of numbers
        .split("\n")
        .filter((x) => x) // remove empties
        .map((x) => JSON.parse(x)) as [Packet, Packet]
  );

function packetsAreInOrder(
  packet1: Packet,
  packet2: Packet
): boolean | typeof NOT_SURE {
  if (Array.isArray(packet1) !== Array.isArray(packet2)) {
    // mix of types, convert to arrays and try again
    return packetsAreInOrder(
      Array.isArray(packet1) ? packet1 : [packet1],
      Array.isArray(packet2) ? packet2 : [packet2]
    );
  }

  if (typeof packet1 === "number" && typeof packet2 === "number") {
    // both are numbers, compare them
    return packet1 === packet2 ? NOT_SURE : packet1 < packet2;
  }

  // sanity checks to make TS happy
  assert(Array.isArray(packet1));
  assert(Array.isArray(packet2));

  // both are arrays, walk in sequence
  const maxSize = Math.max(packet1.length, packet2.length);
  for (let i = 0; i < maxSize; i++) {
    if (packet1[i] === undefined) {
      // packet 1 ran out of items first, correct order
      return true;
    }
    if (packet2[i] === undefined) {
      // packet 2 ran out of items first, incorrect order
      return false;
    }

    const subPacketsAreInOrder = packetsAreInOrder(packet1[i], packet2[i]);
    if (subPacketsAreInOrder !== NOT_SURE) {
      return subPacketsAreInOrder;
    }
  }

  // both packets had the same size and same items, continue checking
  return NOT_SURE;
}

// ------------------ part 1 ------------------
const inOrderIndexSum = pairsOfPackets
  // check which packets are in order
  .map(([packet1, packet2], index) => ({
    inOrder: packetsAreInOrder(packet1, packet2),
    index: index + 1,
  }))
  // filter to only those in order
  .filter((x) => x.inOrder)
  // sum indexes
  .reduce((a, b) => a + b.index, 0);

console.log("Part 1: inOrderIndexSum", inOrderIndexSum); // 5808

// ------------------ part 2 ------------------
// flat array of all packets + dividers
const allPackets = [...pairsOfPackets.flat(), [[2]], [[6]]];
allPackets.sort((a, b) => (packetsAreInOrder(a, b) ? -1 : 1));

// find divider packets
const div1 =
  allPackets.findIndex((packet) => JSON.stringify(packet) === "[[2]]") + 1;
const div2 =
  allPackets.findIndex((packet) => JSON.stringify(packet) === "[[6]]") + 1;

const decoderKey = div1 * div2;
console.log("Part 2: decoderKey", decoderKey);
