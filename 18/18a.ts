import * as fs from "fs";
import { equal } from "assert";

interface Position {
  x: number;
  y: number;
  z: number;
}

const cubes: Position[] = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n") // split each cube
  .filter((x) => x)
  .map((cubeString) => {
    const [x, y, z] = cubeString.split(",").map((x) => parseInt(x, 10));
    return { x, y, z };
  });

function isCubeAtPosition(position: Position): boolean {
  return cubes.some(
    (c) => c.x === position.x && c.y === position.y && c.z === position.z
  );
}

function numExposedSidesOfCube(cube: Position): number {
  return [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: -1 },
  ]
    .map((p) => ({
      x: cube.x + p.x,
      y: cube.y + p.y,
      z: cube.z + p.z,
    }))
    .filter((p) => !isCubeAtPosition(p)).length;
}

const surfaceArea = cubes
  .map((cube) => numExposedSidesOfCube(cube))
  .reduce((a, b) => a + b, 0);

console.log("Part 1: surfaceArea", surfaceArea);
equal(surfaceArea, 3526);
