import * as fs from "fs";
import assert from "assert";

class Sensor {
  public readonly sensorX: number;
  public readonly sensorY: number;
  public readonly beaconX: number;
  public readonly beaconY: number;
  public readonly searchRadius: number;

  constructor(descriptionString: string) {
    const matchArr = descriptionString.match(
      /Sensor at x=(-?[0-9]+), y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), y=(-?[0-9]+)/
    );
    assert(matchArr);

    [, this.sensorX, this.sensorY, this.beaconX, this.beaconY] = matchArr.map(
      (x) => parseInt(x, 10)
    );

    this.searchRadius = this.distanceTo(this.beaconX, this.beaconY);
  }

  public distanceTo(x: number, y: number): number {
    return Math.abs(x - this.sensorX) + Math.abs(y - this.sensorY);
  }

  public inScanRange(x: number, y: number): boolean {
    return this.distanceTo(x, y) <= this.searchRadius;
  }

  public *outerBoundary(): Iterable<{ x: number; y: number }> {
    // can iterate over this to walk the outer boundary of a given sensors search region
    const boundaryRadius = this.searchRadius + 1;

    // top -> left
    for (
      let x = this.sensorX - boundaryRadius, y = this.sensorY;
      x < this.sensorX;
      x++, y++
    ) {
      yield { x, y };
    }

    // left -> bottom
    for (
      let x = this.sensorX, y = this.sensorY + boundaryRadius;
      y > this.sensorY;
      x++, y--
    ) {
      yield { x, y };
    }

    // bottom -> right
    for (
      let x = this.sensorX + boundaryRadius, y = this.sensorY;
      x > this.sensorX;
      x--, y--
    ) {
      yield { x, y };
    }

    // right -> top
    for (
      let x = this.sensorX, y = this.sensorY - boundaryRadius;
      x > this.sensorX;
      x--, y--
    ) {
      yield { x, y };
    }
  }
}

const sensors = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .filter((x) => x)
  .map((x) => new Sensor(x));

// -------- part 1 ---------
const largestSearchRadius = Math.max(...sensors.map((x) => x.searchRadius));
const startX = Math.min(...sensors.map((x) => x.sensorX)) - largestSearchRadius;
const endX = Math.max(...sensors.map((x) => x.sensorX)) + largestSearchRadius;
const y = 2000000;

// search & count em
let numPositionsBeaconCanNotExist = 0;
for (let x = startX; x < endX; x++) {
  const isBeacon = sensors.some(
    (sensor) => sensor.beaconX === x && sensor.beaconY === y
  );
  const isScannedPosition = sensors.some(
    (sensor) =>
      // check if sensor would have seen a beacon at this point
      // There is never a tie where two beacons are the same distance to a sensor
      sensor.distanceTo(x, y) <= sensor.searchRadius
  );

  if (!isBeacon && isScannedPosition) {
    numPositionsBeaconCanNotExist++;
  }
}

console.log(
  "Part 1: numPositionsBeaconCanNotExist",
  numPositionsBeaconCanNotExist
);

// -------- part 2 ---------
function findUnscannedLocation() {
  for (const sensor of sensors) {
    for (const { x, y } of sensor.outerBoundary()) {
      if (x < 0 || y < 0 || x > 4000000 || y > 4000000) {
        continue;
      }

      // THIS scanner can't see this spot (just out of range)
      // check if any OTHER scanners can see this spot (if so, there can't be a beacon there)
      const wasScannedByOtherScanner = sensors.some((s) => s.inScanRange(x, y));

      if (!wasScannedByOtherScanner) {
        // found a spot that no one scanned!
        return { x, y };
      }
    }
  }

  assert(false);
}

const unscannedLocation = findUnscannedLocation();
const tuningFrequency = unscannedLocation.x * 4000000 + unscannedLocation.y;
console.log(
  `Part 2: tuning frequency`,
  tuningFrequency,
  `(x:${unscannedLocation.x}, y:${unscannedLocation.y})`
);
