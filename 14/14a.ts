import * as fs from "fs";

enum Terrain {
  Air = ".",
  Rock = "#",
  Sand = "o",
}

type Point = { x: number; y: number };

// read the terrain scan and convert to a list of lines
const rockLines: Array<[Point, Point]> = [];
fs.readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .filter((x) => x)
  // for each rock
  .forEach((rockBorderString) => {
    let lastPoint: null | Point = null;

    rockBorderString
      .split(" -> ")
      // for each point
      .forEach((rockLineString) => {
        const [x, y] = rockLineString.split(",").map((x) => parseInt(x));
        const thisPoint = { x, y };

        if (lastPoint !== null) {
          // draw a line in the terrain
          rockLines.push([lastPoint, thisPoint]);
        }

        lastPoint = thisPoint;
      });
  });

// find our scan boundaries, with a 1 unit border
const minX = Math.min(...rockLines.flatMap((line) => [line[0].x, line[1].x]));
const maxX = Math.max(...rockLines.flatMap((line) => [line[0].x, line[1].x]));
const maxY = Math.max(...rockLines.flatMap((line) => [line[0].y, line[1].y]));

const xOffset = minX - 1;
const caveWidth = maxX - minX + 3; // 1 because last item is ON maxX, 2 for buffer on either side
const caveHeight = maxY + 1;
const sandEntryPoint = 500 - xOffset;

// create & populate cave array with air
const cave: Terrain[][] = []; // [y][x]
for (let y = 0; y < caveHeight; y++) {
  cave.push(new Array(caveWidth).fill(Terrain.Air));
}

// draw in our lines of rock
rockLines.forEach(([start, end]) => {
  if (start.x === end.x) {
    // vertical line
    const startY = Math.min(start.y, end.y);
    const endY = Math.max(start.y, end.y);
    for (let i = startY; i <= endY; i++) {
      cave[i][start.x - xOffset] = Terrain.Rock;
    }
  } else {
    // horizontal line
    const startX = Math.min(start.x, end.x);
    const endX = Math.max(start.x, end.x);
    for (let i = startX; i <= endX; i++) {
      cave[start.y][i - xOffset] = Terrain.Rock;
      // cave[start.y][i - xOffset] = (i - xOffset).toString() as any;
    }
  }
});

// returns true if sand hit the bottom of the cave
function dropSand(): boolean {
  const pos: Point = { x: sandEntryPoint, y: 0 };

  while (pos.y < caveHeight - 1) {
    // try to move down
    if (cave[pos.y + 1][pos.x] === Terrain.Air) pos.y++;
    // try to move diagonally left
    else if (cave[pos.y + 1][pos.x - 1] === Terrain.Air) pos.x--;
    // try to move diagonally right
    else if (cave[pos.y + 1][pos.x + 1] === Terrain.Air) pos.x++;
    // we are blocked, settle the sand
    else {
      cave[pos.y][pos.x] = Terrain.Sand;
      return false;
    }
  }
  // must have hit the bottom of the cave
  return true;
}

let numSandDropped = 0;
while (!dropSand()) {
  numSandDropped++;
}

// print the cave, just for fun
cave.forEach((caveRow) => {
  caveRow.forEach((terrain) => process.stdout.write(terrain));
  process.stdout.write("\n");
});
console.log("Sand dropped before overflowing:", numSandDropped);
