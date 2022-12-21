import * as fs from "fs";
import { equal } from "assert";

const decryptionKey = 811589153;

const numbers = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .filter((x) => x)
  .map((stringValue, originalIndex) => ({
    value: parseInt(stringValue, 10) * decryptionKey, // multiply by decryption key
    originalIndex, // tack on original index so we can always find this item
  }));

for (let mix = 0; mix < 10; mix++) {
  for (let i = 0; i < numbers.length; i++) {
    const itemIndex = numbers.findIndex((x) => x.originalIndex === i)!;
    const item = numbers[itemIndex];

    const newIndex = (itemIndex + item.value) % (numbers.length - 1); // where should the item be

    numbers.splice(itemIndex, 1); // remove the item
    numbers.splice(newIndex, 0, item); // re-add the item
  }
}

const indexForValueZero = numbers.findIndex((x) => x.value === 0);
const output = [1000, 2000, 3000]
  .map((i) => numbers[(i + indexForValueZero) % numbers.length].value) // calculate offset & look up value
  .reduce((a, b) => a + b, 0); // sum item values

console.log("Part 2:", output);
equal(output, 2455057187825);
