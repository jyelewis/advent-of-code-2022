import * as fs from "fs";

type Position = { x: number; y: number };
type PositionStr = `${Position["x"]},${Position["y"]}`; // string version of position, joins numbers so we can index
type PositionAndPath = { position: Position; pathLength: number };

// will be populated when we parse the heightmap
let startingPosition = { x: 0, y: 0 };
let destinationPosition = { x: 0, y: 0 };
const aPositions: Position[] = [];

const heightMap: number[][] = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .filter((x) => x)
  .map((row, y) =>
    row.split("").map((heightMapChar, x) => {
      if (heightMapChar === "S") {
        // starting position, lowest possible point
        startingPosition = { x, y };
        return 0;
      }
      if (heightMapChar === "E") {
        // destination, highest point
        destinationPosition = { x, y };
        return 27;
      }
      if (heightMapChar === "a") {
        aPositions.push({ x, y });
      }

      // map letters to numbers
      // a = 1, z = 26
      return heightMapChar.charCodeAt(0) - "a".charCodeAt(0) + 1;
    })
  );

const mapHeight = heightMap.length;
const mapWidth = heightMap[0].length;

function shortestPathToDestination(initialPositions: Position[]) {
  const positionsToExplore: PositionAndPath[] = initialPositions.map(
    (position) => ({ position, pathLength: 0 })
  );
  const seenPositions = new Set<PositionStr>();

  let positionAndPath: undefined | PositionAndPath = undefined;
  while ((positionAndPath = positionsToExplore.shift())) {
    const { position, pathLength } = positionAndPath;

    // check if we've already been here, if so skip
    const positionStr: PositionStr = `${position.x},${position.y}`;
    if (seenPositions.has(positionStr)) {
      continue; // already been here
    }
    seenPositions.add(positionStr);

    const currentElevation = heightMap[position.y][position.x];
    if (currentElevation === 27) {
      // reached our destination
      return pathLength;
    }

    [
      { y: position.y - 1, x: position.x }, // up
      { y: position.y + 1, x: position.x }, // down
      { y: position.y, x: position.x - 1 }, // left
      { y: position.y, x: position.x + 1 }, // right
    ]
      .filter(
        (pos) =>
          // check position is valid
          pos.y >= 0 &&
          pos.y < mapHeight &&
          pos.x >= 0 &&
          pos.x < mapWidth &&
          // check position is not too high to step up to
          heightMap[pos.y][pos.x] - 1 <= currentElevation
      )
      .forEach((potentialNewPosition) =>
        // enqueue for future exploring
        positionsToExplore.push({
          position: potentialNewPosition,
          pathLength: pathLength + 1,
        })
      );
    // check all 4 directions for future exploring
  }
}

// ----------- part 1 --------------
const shortestPathFromS = shortestPathToDestination([startingPosition]);
console.log("Shortest path from S is", shortestPathFromS, "steps");

// ----------- part 2 --------------
const shortestPathFromA = shortestPathToDestination(aPositions);
console.log("Shortest path from any 'a' is", shortestPathFromA, "steps");
