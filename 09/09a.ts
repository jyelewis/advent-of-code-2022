import * as fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt").toString();

type Direction = "U" | "D" | "L" | "R";

class Rope {
  public head = { x: 0, y: 0 };
  public tail = { x: 0, y: 0 };

  public tailPositions = [this.tail];

  public moveHead(deltaX: number, deltaY: number) {
    this.head = {
      x: this.head.x + deltaX,
      y: this.head.y + deltaY,
    };

    // work out where we need to move the tail
    const xDistanceToHead = this.head.x - this.tail.x;
    const yDistanceToHead = this.head.y - this.tail.y;

    if (xDistanceToHead === -2) {
      if (yDistanceToHead === -1) this.moveTail(-1, -1);
      if (yDistanceToHead === 0) this.moveTail(-1, 0);
      if (yDistanceToHead === 1) this.moveTail(-1, 1);
    }
    if (xDistanceToHead === -1) {
      if (yDistanceToHead === -2) this.moveTail(-1, -1);
      if (yDistanceToHead === 2) this.moveTail(-1, 1);
    }
    if (xDistanceToHead === 0) {
      if (yDistanceToHead === -2) this.moveTail(0, -1);
      if (yDistanceToHead === 2) this.moveTail(0, 1);
    }
    if (xDistanceToHead === 1) {
      if (yDistanceToHead === -2) this.moveTail(1, -1);
      if (yDistanceToHead === 2) this.moveTail(1, 1);
    }
    if (xDistanceToHead === 2) {
      if (yDistanceToHead === -1) this.moveTail(1, -1);
      if (yDistanceToHead === 0) this.moveTail(1, 0);
      if (yDistanceToHead === 1) this.moveTail(1, 1);
    }
  }

  public moveTail(deltaX: number, deltaY: number) {
    this.tail = {
      x: this.tail.x + deltaX,
      y: this.tail.y + deltaY,
    };

    // keep track of all positions the tail has been in
    this.tailPositions.push(this.tail);
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

// follow directions, move rope head around
const rope = new Rope();
for (const direction of directions) {
  // move head
  if (direction === "U") rope.moveHead(0, 1);
  if (direction === "D") rope.moveHead(0, -1);
  if (direction === "L") rope.moveHead(-1, 0);
  if (direction === "R") rope.moveHead(1, 0);
}

// find all unique positions the tail visited
const uniqueTailPositions = new Set(
  rope.tailPositions.map((pos) => `${pos.x}-${pos.y}`)
);
console.log("num uniqueTailPositions", uniqueTailPositions.size);
