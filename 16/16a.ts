import * as fs from "fs";
import { equal } from "assert";
import {
  examplePreComputedPathsCache,
  preComputedPathsCache,
} from "./preComputedPathsCache";

type ValveName = string;
interface Valve {
  name: ValveName;
  flow: number;
  destinationValves: ValveName[];
}

function run(
  inputPath: string,
  preComputedPathsCache?: Record<string, number>
) {
  // parse valves
  const indexedValves: Record<ValveName, Valve> = {};
  const valves = fs
    .readFileSync(__dirname + "/" + inputPath)
    .toString()
    .split("\n")
    .filter((x) => x) // remove empty lines
    .map((line) =>
      line.match(
        /Valve ([A-Z][A-Z]) has flow rate=([0-9]+); tunnels? leads? to valves? (.+)/
      )
    )
    .filter((x) => x) // remove non-matching lines;
    .map((match) => {
      const [, valveName, flowString, destinationsString] = match as string[];
      const valve = {
        name: valveName,
        flow: parseInt(flowString, 10),
        destinationValves: destinationsString.split(",").map((x) => x.trim()),
      } as Valve;

      indexedValves[valveName] = valve;
      return valve;
    });

  const flowingValves = valves.filter((x) => x.flow > 0);
  flowingValves.sort((a, b) => b.flow - a.flow);

  const pathCache: Record<string, number> = { ...preComputedPathsCache };

  function shortestPathBetweenValves(fromValve: Valve, toValve: Valve): number {
    // cached DFS to find the shortest path to get from one valve to another
    const cacheStr = `${fromValve.name}->${toValve.name}`;
    const cachedValue = pathCache[cacheStr];
    if (cachedValue) {
      return cachedValue;
    }

    const valvesToSearch: Array<{ valveName: ValveName; distance: number }> = [
      ...fromValve.destinationValves.map((x) => ({
        valveName: x,
        distance: 1,
      })),
    ];
    const seenValves = new Set<ValveName>();

    while (valvesToSearch.length > 0) {
      const { valveName, distance } = valvesToSearch.shift()!;
      if (seenValves.has(valveName)) {
        continue;
      }

      if (valveName === toValve.name) {
        // found it
        // output a pre-compute file if we want it
        // console.log(`"${fromValve.name}->${toValve.name}": ${distance},`);
        pathCache[cacheStr] = distance;
        return distance;
      }

      const currentValve = indexedValves[valveName];

      valvesToSearch.push(
        ...currentValve.destinationValves.map((x) => ({
          valveName: x,
          distance: distance + 1,
        }))
      );
    }

    throw new Error(`Could not find path '${fromValve} -> ${toValve}'`);
  }

  function turnOnValvesInRooms(
    startingValve: Valve,
    valves: Valve[],
    timeRemaining: number,
    gasReleased: number
  ): number {
    const maxGasReleasedForNextStartingValve = valves.map((valve) => {
      // calculate distance to travel to this valve
      const travelTime = shortestPathBetweenValves(startingValve, valve);
      // deduct travel time & switch on valve time
      const newTimeRemaining = timeRemaining - travelTime - 1;

      if (newTimeRemaining <= 0) {
        // we don't have time to turn on this valve, prev value is the best we can do
        return gasReleased;
      }

      const additionalGasReleased = newTimeRemaining * valve.flow;
      const newGasReleased = gasReleased + additionalGasReleased;

      // search onwards for other valves that haven't been turned on yet
      const remainingValves = valves.filter((x) => x !== valve);
      if (remainingValves.length === 0) {
        // we don't have anywhere left to turn on!
        return newGasReleased;
      }

      // turn on some more valves
      return turnOnValvesInRooms(
        valve,
        remainingValves,
        newTimeRemaining,
        newGasReleased
      );
    });

    return Math.max(...maxGasReleasedForNextStartingValve);
  }

  return turnOnValvesInRooms(indexedValves["AA"], flowingValves, 30, 0);
}

const exampleMaximumGasReleased = run(
  "exampleInput.txt",
  examplePreComputedPathsCache
);
equal(exampleMaximumGasReleased, 1651);

const maximumGasReleased = run("input.txt", preComputedPathsCache);
console.log("maximumGasReleased", maximumGasReleased);
equal(maximumGasReleased, 1873);
