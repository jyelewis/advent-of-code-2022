import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

type Direction = "U" | "D" | "L" | "R";

class Knot {
  public pos = { x: 0, y: 0 };

  public positions = [this.pos];

  public constructor(public joinedKnot?: Knot) {}

  public move(deltaX: number, deltaY: number) {
    this.pos = {
      x: this.pos.x + deltaX,
      y: this.pos.y + deltaY,
    };
    // keep track of all the places we have been
    this.positions.push(this.pos);

    if (!this.joinedKnot) {
      // nothing joined to move
      return;
    }

    // work out where we need to move the joined knot
    const xDistanceToHead = this.pos.x - this.joinedKnot.pos.x;
    const yDistanceToHead = this.pos.y - this.joinedKnot.pos.y;

    if (xDistanceToHead === -2) {
      if (yDistanceToHead === -2) this.joinedKnot.move(-1, -1);
      if (yDistanceToHead === -1) this.joinedKnot.move(-1, -1);
      if (yDistanceToHead === 0) this.joinedKnot.move(-1, 0);
      if (yDistanceToHead === 1) this.joinedKnot.move(-1, 1);
      if (yDistanceToHead === 2) this.joinedKnot.move(-1, 1);
    }
    if (xDistanceToHead === -1) {
      if (yDistanceToHead === -2) this.joinedKnot.move(-1, -1);
      if (yDistanceToHead === 2) this.joinedKnot.move(-1, 1);
    }
    if (xDistanceToHead === 0) {
      if (yDistanceToHead === -2) this.joinedKnot.move(0, -1);
      if (yDistanceToHead === 2) this.joinedKnot.move(0, 1);
    }
    if (xDistanceToHead === 1) {
      if (yDistanceToHead === -2) this.joinedKnot.move(1, -1);
      if (yDistanceToHead === 2) this.joinedKnot.move(1, 1);
    }
    if (xDistanceToHead === 2) {
      if (yDistanceToHead === -2) this.joinedKnot.move(1, -1);
      if (yDistanceToHead === -1) this.joinedKnot.move(1, -1);
      if (yDistanceToHead === 0) this.joinedKnot.move(1, 0);
      if (yDistanceToHead === 1) this.joinedKnot.move(1, 1);
      if (yDistanceToHead === 2) this.joinedKnot.move(1, 1);
    }
  }
}

// ------------------------------------------------------------------------------------------

// parse directions
const directions: Direction[] = input
  .split("\n") // split each instruction by line
  .filter((x) => x) // remove empty lines
  .flatMap(
    (
      instructionStr // flatten instructions into an array of directions
    ) =>
      new Array(parseInt(instructionStr.split(" ")[1], 10)).fill(
        instructionStr.split(" ")[0]
      )
  );

// create our rope of knots
// start at the tail and move forward so they can all be joined
const rope: Knot[] = [];
for (let i = 0; i < 10; i++) {
  rope.splice(0, 0, new Knot(rope[0]));
}
const headKnot = rope[0];
const tailKnot = rope[9];

// follow directions, move rope head around
for (const direction of directions) {
  // move head
  if (direction === "U") headKnot.move(0, 1);
  if (direction === "D") headKnot.move(0, -1);
  if (direction === "L") headKnot.move(-1, 0);
  if (direction === "R") headKnot.move(1, 0);
}

// find all unique positions the tail visited
const uniqueTailPositions = new Set(
  tailKnot.positions.map((pos) => `${pos.x}-${pos.y}`)
);
console.log("num uniqueTailPositions", uniqueTailPositions.size);
