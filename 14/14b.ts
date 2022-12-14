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

// in hindsight, this shifting was silly - made it easier to visualise part 1 but broke part 2
const caveXPadding = 250; // additional padding to add to each side
const xOffset = minX - 1 - caveXPadding;
const caveWidth = maxX - minX + 3 + caveXPadding * 2; // 1 because last item is ON maxX, 2 for buffer on either side
const caveHeight = maxY + 3; // give padding for our bottom row
const sandEntryPoint = 500 - xOffset;

// include our floor
rockLines.push([
  { x: minX - 1 - caveXPadding, y: caveHeight - 1 },
  { x: maxX + 1 + caveXPadding, y: caveHeight - 1 },
]);

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
    }
  }
});

function dropSand() {
  const pos: Point = { x: sandEntryPoint, y: 0 };

  do {
    // try to move down
    if (cave[pos.y + 1][pos.x] === Terrain.Air) pos.y++;
    // try to move diagonally left
    else if (cave[pos.y + 1][pos.x - 1] === Terrain.Air) {
      pos.y++;
      pos.x--;
    }
    // try to move diagonally right
    else if (cave[pos.y + 1][pos.x + 1] === Terrain.Air) {
      pos.y++;
      pos.x++;
    }
    // we are blocked, settle the sand
    else {
      cave[pos.y][pos.x] = Terrain.Sand;
      break;
    }
  } while (true);
}

let numSandDropped = 0;
while (cave[0][sandEntryPoint] === Terrain.Air) {
  dropSand();
  numSandDropped++;
}

console.log("Sand dropped before the top of the cave:", numSandDropped);
