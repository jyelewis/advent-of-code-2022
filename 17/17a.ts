import * as fs from "fs";
import assert, { equal } from "assert";

// map indexed 0,0 from bottom left
interface Point {
  x: number;
  y: number;
}

class Rock {
  public points: Point[];

  constructor(points: Point[]) {
    this.points = [...points];
  }

  public hasPoint({ x, y }: Point): boolean {
    return this.points.some((p) => p.x === x && p.y === y);
  }

  // can this be a fixed property?
  public highestY(): number {
    return Math.max(...this.points.map((p) => p.y));
  }

  // in hindsight, probs didn't need this immutability
  public move(deltaX: number, deltaY: number): Rock {
    // limit deltaX between our walls & floor
    const minRockX = Math.min(...this.points.map((p) => p.x));
    const maxRockX = Math.max(...this.points.map((p) => p.x));
    const minRockY = Math.min(...this.points.map((p) => p.y));

    const minX = 0;
    const maxX = 6; // wall width
    const minY = 0; // floor
    deltaX = Math.max(deltaX, minX - minRockX); // clamp to left wall
    deltaX = Math.min(deltaX, maxX - maxRockX); // clamp to right wall
    deltaY = Math.max(deltaY, minY - minRockY); // clamp to floor

    if (deltaX === 0 && deltaY === 0) {
      // no op, return this rock unchanged
      return this;
    }

    const newPoints = this.points.map((p) => ({
      x: p.x + deltaX,
      y: p.y + deltaY,
    }));

    return new Rock(newPoints);
  }
}

class Cave {
  public settledRockPositions = new Set<string>();
  public highestY: number = -1;
  public numFalls = 0;

  public height() {
    return this.highestY + 1; // 0 indexing
  }

  private isRockAt(point: Point): boolean {
    return this.settledRockPositions.has(`${point.x},${point.y}`);
  }

  private rockCollides(rock: Rock): boolean {
    return rock.points.some((p) => this.isRockAt(p));
  }

  private tryMoveRock(rock: Rock, deltaX: number, deltaY: number): Rock {
    // we don't move in multiple steps, so we can't check if collisions over large moves
    assert(deltaX <= 1);
    assert(deltaY <= 1);

    const movedRock = rock.move(deltaX, deltaY);
    if (this.rockCollides(movedRock)) {
      // can't move here, collides with an existing rock
      return rock; // return the original, unmoved rock
    }
    return movedRock;
  }

  public dropRock(rockShape: Point[]) {
    let rock = new Rock(rockShape);
    rock = rock.move(2, this.highestY + 4);

    do {
      // wind changes every fall
      const windDirection = windDirections[
        this.numFalls % windDirections.length
      ] as "<" | ">";
      this.numFalls++;

      // push with wind (no-op if we are against the wall or another rock)
      rock = this.tryMoveRock(rock, windDirection === "<" ? -1 : 1, 0);

      // fall down (no-op if we are already settled)
      const originalRock = rock;
      rock = this.tryMoveRock(rock, 0, -1);
      if (rock === originalRock) {
        // rock couldn't drop any further, it's settled
        break;
      }
    } while (true); // keep going until we can't move anymore

    this.settleRock(rock);
  }

  public settleRock(rock: Rock) {
    rock.points.forEach((p) => this.settledRockPositions.add(`${p.x},${p.y}`));

    const rockHighestY = rock.highestY();
    if (rockHighestY > this.highestY) {
      this.highestY = rockHighestY;
    }
  }
}

// --------------------------------------------------------

const windDirections = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .trim();

const rockShapes: Point[][] = [
  // "####",
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],

  // .#.
  // ###
  // .#.
  [
    { x: 1, y: 2 }, // top row
    { x: 0, y: 1 }, // middle row
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 0 }, // bottom row
  ],

  // ..#
  // ..#
  // ###
  [
    { x: 2, y: 2 }, // top row
    { x: 2, y: 1 }, // middle row
    { x: 0, y: 0 }, // bottom row
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],

  // #
  // #
  // #
  // #`
  [
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ],

  // ##
  // ##
  [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
];

const cave = new Cave();
for (let i = 0; i < 2022; i++) {
  const rockShape = rockShapes[i % rockShapes.length];
  cave.dropRock(rockShape);
}

const caveHeight = cave.height();
console.log("Part 1:", caveHeight);
equal(caveHeight, 3109);
