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

  public hashTopOfCave(): string {
    const rockBitmap: boolean[] = [];
    // hash top 5 rows
    for (let y = this.highestY - 5; y <= this.highestY; y++) {
      for (let x = 0; x < 7; x++) {
        rockBitmap.push(this.isRockAt({ x, y }));
      }
    }

    return rockBitmap.map((x) => (x ? "1" : "0")).join("");
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

// ------------------------------------------------------------------

function findRepeatingPattern() {
  const seenStates = new Map<string, number>(); // hash of state + how many blocks had dropped when we got here
  const heightAfterNBlocksDropped: number[] = [0]; // 0 blocks = 0 height

  const cave = new Cave();
  for (let i = 0; i < 10_000; i++) {
    // keep building until we see a repeating pattern

    const rockShape = rockShapes[i % rockShapes.length];
    const windDirection = cave.numFalls % windDirections.length;
    cave.dropRock(rockShape);

    // store the height we are at after n blocks
    heightAfterNBlocksDropped.push(cave.height());

    // if we end up with all these 3 values being identical, we are going to repeat again
    const stateHash = `${cave.hashTopOfCave()}-${rockShape}-${windDirection}`;
    const numBlocksDropped = i + 1;
    if (seenStates.has(stateHash)) {
      // we've been in this state before!
      const blocksDroppedToGetPatternBase = seenStates.get(stateHash)!;
      const patternNumBlocks = numBlocksDropped - blocksDroppedToGetPatternBase;

      const heightAtPatternBase =
        heightAfterNBlocksDropped[blocksDroppedToGetPatternBase];
      const patternHeight = cave.height() - heightAtPatternBase;

      // take the height from
      const patternHeightAtNBlocks = heightAfterNBlocksDropped
        .slice(blocksDroppedToGetPatternBase)
        .map((x) => x - heightAtPatternBase);

      return {
        blocksDroppedToGetPatternBase,
        heightAtPatternBase,

        patternNumBlocks,
        patternHeight,

        patternHeightAtNBlocks,
      };
    }

    seenStates.set(stateHash, numBlocksDropped);
  }

  throw new Error("Couldn't find a repeating pattern");
}

function calculateHeightAfterNDrops(nDrops: number): number {
  // find re-occurring pattern in the tower
  const pattern = findRepeatingPattern();

  // only works for tall towers
  assert(nDrops >= pattern.blocksDroppedToGetPatternBase);

  nDrops = nDrops - pattern.blocksDroppedToGetPatternBase;
  const numPatterns = Math.floor(nDrops / pattern.patternNumBlocks);

  const leftOver = nDrops - numPatterns * pattern.patternNumBlocks;

  const patternCalculatedHeight =
    pattern.heightAtPatternBase +
    pattern.patternHeight * numPatterns +
    pattern.patternHeightAtNBlocks[leftOver];

  return patternCalculatedHeight;
}

const towerHeight = calculateHeightAfterNDrops(1000000000000);
console.log("Part 2:", towerHeight);
equal(towerHeight, 1541449275365);
