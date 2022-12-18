import * as fs from "fs";
import { equal } from "assert";

interface Position {
  x: number;
  y: number;
  z: number;
}
function hashPosition(position: Position): string {
  return `${position.x},${position.y},${position.z}`;
}

const positions: Position[] = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n") // split each cube
  .filter((x) => x)
  .map((cubeString) => {
    const [x, y, z] = cubeString.split(",").map((x) => parseInt(x, 10));
    return { x, y, z };
  });

const maxX = Math.max(...positions.map((p) => p.x));
const minX = Math.min(...positions.map((p) => p.x));
const maxY = Math.max(...positions.map((p) => p.y));
const minY = Math.min(...positions.map((p) => p.y));
const maxZ = Math.max(...positions.map((p) => p.z));
const minZ = Math.min(...positions.map((p) => p.z));

function isItemAtPosition(position: Position): boolean {
  return positions.some(
    (c) => c.x === position.x && c.y === position.y && c.z === position.z
  );
}

function numExposedSidesOfPosition(position: Position): number {
  return getEmptyNeighbours(position).length;
}

function getEmptyNeighbours(position: Position) {
  return [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: -1 },
  ]
    .map((p) => ({
      x: position.x + p.x,
      y: position.y + p.y,
      z: position.z + p.z,
    }))
    .filter((p) => !isItemAtPosition(p));
}

function fillModelHoles() {
  // 1. make a set of every adjacent position to the model
  // 2. for each position, try a flood fill for x runs
  // 3. check this position hasn't already been attempted
  // 3. if the fill completes, commit the fill - else abandon it
  const positionsWithAttemptedFloodFill = new Set();

  // 1. make a set of every adjacent position to the model
  // not bothering to de-dupe, will bail early if already attempted anyway
  positions.flatMap(getEmptyNeighbours).forEach((initialPosition) => {
    // check this position hasn't already been flood filled
    const initialPositionHash = hashPosition(initialPosition);
    if (positionsWithAttemptedFloodFill.has(initialPositionHash)) {
      return;
    }
    positionsWithAttemptedFloodFill.add(initialPositionHash);

    // set a max distance we are willing to travel for this flood fill
    const floodFillQueue: Position[] = [initialPosition];
    const floodFilledItems: Position[] = [];
    const floodFillSeenItems = new Set(); // second set to avoid checking the same item twice
    while (true) {
      // 100 -> 1000 seem to give the same value
      const position = floodFillQueue.pop();
      if (position === undefined) {
        // nothing in the queue!
        // we've successfully filled an area

        // commit our fill
        positions.push(...floodFilledItems);
        return;
      }

      // check if we have wandered of out bounds,
      // if so we aren't contained inside the droplet
      if (
        position.x < minX ||
        position.x > maxX ||
        position.y < minY ||
        position.y > maxY ||
        position.z < minZ ||
        position.z > maxZ
      ) {
        // out of bounds, give up without committing
        return;
      }

      const positionHash = hashPosition(position);

      // new item to search
      // mark it as visited
      if (floodFillSeenItems.has(positionHash)) {
        // ignore this one, already seen it
        continue;
      }
      floodFillSeenItems.add(positionHash);

      // fill this item
      floodFilledItems.push(position);

      // queue neighbours
      floodFillQueue.push(...getEmptyNeighbours(position));
    }
  });
}

fillModelHoles();

const externalSurfaceArea = positions
  .map((cube) => numExposedSidesOfPosition(cube))
  .reduce((a, b) => a + b, 0);

console.log("Part 2: externalSurfaceArea", externalSurfaceArea);
equal(externalSurfaceArea, 2090);
