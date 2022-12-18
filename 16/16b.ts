// plz don't judge my code, could be dramatically simplified
// but I would like nothing more than to never see this problem again

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

  // returns an array of tuples, one for you to open, one for the elephant
  function generateSplitListsOfValves() {
    // horribly inefficient permutations generator
    // goal is to generate the shortest list with every combination of sites to visit
    // bit of a shortcut, but this is assuming the solution involves both people getting the same list of valves
    // may not always be true, particularly if we aren't running out of time before opening all valves
    // this has worked for me so far though 🤷‍♂️ and requires much less computation

    function permutations(valves: Valve[], itemsToSelect: number): Valve[][] {
      let retVal: Valve[][] = [];
      for (const valve of valves) {
        if (itemsToSelect === 1) {
          return [[valve]];
        }

        const remainingValves = valves.filter((x) => x !== valve);
        const subPermutations = permutations(
          remainingValves,
          itemsToSelect - 1
        );
        retVal = retVal.concat(subPermutations.map((x) => [valve, ...x]));
      }

      return retVal;
    }

    const myValveOptions = permutations(
      flowingValves,
      Math.floor(flowingValves.length / 2)
    );
    const flowingValvesSplits = myValveOptions.map((myValveOptions) => [
      // these permutations
      myValveOptions,
      // whatever is left
      flowingValves.filter((x) => myValveOptions.indexOf(x) === -1),
    ]);

    // doesn't really take too long to generate all permutations
    // generate them all then de-dupe
    const existingPermutations = new Set<string>();
    const dedupedFlowingValvesSplits = flowingValvesSplits.filter(
      ([myItems, elephantItems]) => {
        const str1 = myItems.map((x) => x.name).join("-");
        const str2 = elephantItems.map((x) => x.name).join("-");

        if (existingPermutations.has(str1) || existingPermutations.has(str2)) {
          // a duplicate already exists, drop this item
          return false;
        }

        existingPermutations.add(str1);
        existingPermutations.add(str2);
        return true;
      }
    );

    return dedupedFlowingValvesSplits;
  }

  function optimisedTurnOnValvesInRooms(
    startingValve: Valve,
    valves: Valve[],
    timeRemaining: number,
    gasReleased: number
  ) {
    // potential optimisation, bail if we know it's not possible to beat the best seen solution
    let bestKnownSolution = 0;
    function turnOnValvesInRooms(
      startingValve: Valve,
      valves: Valve[],
      timeRemaining: number,
      gasReleased: number
    ): number {
      // early bail case
      // if we turned on every valve now, and couldn't beat the best known solution
      // then there is no point going further, we'll never find a good solution down this pat
      const highestPossibleValue =
        gasReleased +
        valves.map((x) => x.flow * timeRemaining).reduce((a, b) => a + b, 0);
      if (highestPossibleValue <= bestKnownSolution) {
        // not possible to find a better solution here, give up
        // improves search time by ~8x
        return 0;
      }

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

      const maxGasReleased = Math.max(...maxGasReleasedForNextStartingValve);
      if (maxGasReleased > bestKnownSolution) {
        bestKnownSolution = maxGasReleased;
      }

      return maxGasReleased;
    }

    return turnOnValvesInRooms(
      startingValve,
      valves,
      timeRemaining,
      gasReleased
    );
  }

  const valvesSplits = generateSplitListsOfValves();

  const startingValve = indexedValves["AA"];
  const gasReleasedByEachSplit = valvesSplits.map(
    ([myValves, elephantValves]) => {
      const gasReleasedByMe = optimisedTurnOnValvesInRooms(
        startingValve,
        myValves,
        26,
        0
      );
      const gasReleasedByElephant = optimisedTurnOnValvesInRooms(
        startingValve,
        elephantValves,
        26,
        0
      );

      return gasReleasedByMe + gasReleasedByElephant;
    }
  );

  return Math.max(...gasReleasedByEachSplit);
}

const exampleMaximumGasReleased = run(
  "exampleInput.txt",
  examplePreComputedPathsCache
);
equal(exampleMaximumGasReleased, 1707);

const myInputGasReleased = run("input.txt", preComputedPathsCache);
console.log("myInputGasReleased", myInputGasReleased);
equal(myInputGasReleased, 2425);
