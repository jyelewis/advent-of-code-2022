import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

function findEndOfFirstMarker(markerLength: number) {
  // scan through the string, character by character
  for (let i = 0; i < input.length - markerLength; i++) {
    // look forward for a marker
    const potentialMarker = input.substring(i, i + markerLength);

    // check if all characters in our potential marker are unique
    if (new Set(potentialMarker).size === markerLength) {
      // x unique characters!
      // return the position of the END of the marker (cursor is at the start, looking forward)
      return i + markerLength;
    }
  }

  throw new Error("Marker never found");
}

console.log("4", findEndOfFirstMarker(4));
console.log("14", findEndOfFirstMarker(14));
