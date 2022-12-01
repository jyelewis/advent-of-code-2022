import * as fs from 'fs';

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const itemsPerElf = input
  .split("\n\n") // split each elf by blank line
  .map(elfRows => elfRows // parse out each string of lines into an array of numbers
    .split("\n")
    .filter(x => x)
    .map(x => parseInt(x))
  );

// sum each array of elf items into a single number
const caloriesPerElf = itemsPerElf.map(elfItems =>
  elfItems.reduce((x, y) => x + y, 0)
);

// find the highest value
caloriesPerElf.sort((a, b) => b - a);
const mostCalories = caloriesPerElf[0];
const top3CaloriesSummed = caloriesPerElf[0] + caloriesPerElf[1] + caloriesPerElf[2];

console.log("Most: ", mostCalories);
console.log("Top 3: ", top3CaloriesSummed);
