import * as fs from "fs";

const monkeys = new Map<number, Monkey>();
class Operation {
  private lhs: "old" | number;
  private operator: "+" | "*";
  private rhs: "old" | number;

  constructor(operationString: string) {
    const [lhsStr, operatorStr, rhsStr] = operationString.split(" ");
    this.lhs = lhsStr === "old" ? "old" : parseInt(lhsStr, 10);
    this.rhs = rhsStr === "old" ? "old" : parseInt(rhsStr, 10);
    this.operator = operatorStr as "+" | "*";
  }

  public execute(oldVal: number) {
    const lhsValue = this.lhs === "old" ? oldVal : this.lhs;
    const rhsValue = this.rhs === "old" ? oldVal : this.rhs;
    switch (this.operator) {
      case "*":
        return lhsValue * rhsValue;
      case "+":
        return lhsValue + rhsValue;
    }
  }
}
class Monkey {
  public index: number;
  public items: number[];
  public operation: Operation;
  public testDivisibleNumber: number;
  public trueDestMonkey: number;
  public falseDestMonkey: number;

  public numInspections: number = 0;

  public overflowAt: number = Infinity;

  public constructor(descriptionString: string) {
    /*
    Monkey 0:
      Starting items: 79, 98
      Operation: new = old * 19
      Test: divisible by 23
        If true: throw to monkey 2
        If false: throw to monkey 3
     */
    const [
      indexString,
      startingItemsString,
      operationString,
      testString,
      trueString,
      falseString,
    ] = descriptionString.split("\n").map((x) => x.trim());

    this.index = parseInt(indexString.match(/Monkey ([0-9]):/)![1], 10);

    this.items = startingItemsString
      .match(/Starting items: (.+)/)![1]
      .split(",")
      .map((x) => parseInt(x.trim(), 10));

    this.operation = new Operation(
      operationString.match(/Operation: new = (.+)/)![1]
    );

    this.testDivisibleNumber = parseInt(
      testString.match(/Test: divisible by ([0-9]+)/)![1],
      10
    );
    this.trueDestMonkey = parseInt(
      trueString.match(/If true: throw to monkey ([0-9]+)/)![1],
      10
    );
    this.falseDestMonkey = parseInt(
      falseString.match(/If false: throw to monkey ([0-9]+)/)![1],
      10
    );
  }

  public takeTurn() {
    while (this.items.length > 0) {
      this.inspectFirstItem();
    }
  }

  public inspectFirstItem() {
    this.numInspections++;

    // load initial worry level
    let worryLevel = this.items.shift()!;

    // update the worry level with personal operation
    worryLevel = this.operation.execute(worryLevel);

    // pre-emptively overflow at a safe number
    worryLevel %= this.overflowAt;

    // check which monkey we want to send this item to
    const itemPassesTest = worryLevel % this.testDivisibleNumber === 0;
    const destinationMonkey = monkeys.get(
      itemPassesTest ? this.trueDestMonkey : this.falseDestMonkey
    )!;

    // throw our item to another monkey
    destinationMonkey.items.push(worryLevel);
  }
}

// parse our input, construct & index the monkeys
fs.readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n\n") // split each monkey by blank line
  .map((descriptionString) => new Monkey(descriptionString))
  .forEach((monkey) => monkeys.set(monkey.index, monkey));

// populate the monkeys with a global overflow they can safely use to avoid
// our worry level growing too high
// by overflowing exactly at the multiple of all our division tests,
// we avoid breaking any further division tests while also avoiding a number that grows forever
const overflowAt = Array.from(monkeys.values())
  .map((x) => x.testDivisibleNumber)
  .reduce((a, b) => a * b, 1);
monkeys.forEach((x) => (x.overflowAt = overflowAt));

// run for 10000 rounds
for (let i = 0; i < 10000; i++) {
  monkeys.forEach((monkey) => monkey.takeTurn());
}

// print our entire state
for (const monkey of monkeys.values()) {
  console.log(
    `Monkey ${monkey.index} has inspected ${monkey.numInspections} items`
  );
}

// find top monkeys by inspection count
const monkeyInspections = Array.from(monkeys.values()).map(
  (x) => x.numInspections
);
monkeyInspections.sort((a, b) => b - a);

const monkeyBusiness = monkeyInspections[0] * monkeyInspections[1];

console.log("monkeyBusiness", monkeyBusiness);
