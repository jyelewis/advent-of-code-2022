import * as fs from "fs";
import { equal } from "assert";

interface Blueprint {
  blueprintNumber: number;
  oreRobotOreCost: number;
  clayRobotOreCost: number;
  obsidianRobotOreCost: number;
  obsidianRobotClayCost: number;
  geodeRobotOreCost: number;
  geodeRobotObsidianCost: number;
}

interface GameState {
  minute: number;
  resources: {
    ore: number;
    clay: number;
    obsidian: number;
    geodes: number;
  };
  robots: {
    oreCollectors: number;
    clayCollectors: number;
    obsidianCollectors: number;
    geodeCollectors: number;
  };
}

// parse input
const blueprints: Blueprint[] = fs
  .readFileSync(__dirname + "/input.txt")
  .toString()
  .split("\n")
  .filter((x) => x)
  .map((blueprintString) => {
    const [
      ,
      blueprintNumber,
      oreRobotOreCost,
      clayRobotOreCost,
      obsidianRobotOreCost,
      obsidianRobotClayCost,
      geodeRobotOreCost,
      geodeRobotObsidianCost,
    ] = blueprintString
      .match(
        /Blueprint ([0-9]+): Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian./
      )!
      .map((x) => parseInt(x, 10));

    return {
      blueprintNumber,
      oreRobotOreCost,
      clayRobotOreCost,
      obsidianRobotOreCost,
      obsidianRobotClayCost,
      geodeRobotOreCost,
      geodeRobotObsidianCost,
    };
  });

// take game state, spits out all possible future game states

function maxGeodesForBlueprint(blueprint: Blueprint, maxTime: number): number {
  function highestOptimisticScoreForState(gs: GameState): number {
    if (gs.minute < 5) {
      // too hard to predict, don't bother
      return Infinity;
    }

    // assuming we create a geode collector every minute from here -> 24, could we beat our high score?
    let theoreticalObsidianCollectors = gs.robots.obsidianCollectors;
    let theoreticalObsidian = gs.resources.obsidian;

    let theoreticalGeodeCollectors = gs.robots.geodeCollectors;
    let theoreticalGeodes = gs.resources.geodes;
    for (let minute = gs.minute; minute < maxTime; minute++) {
      if (theoreticalObsidian >= blueprint.geodeRobotObsidianCost) {
        theoreticalGeodeCollectors++; // build more if we can
        theoreticalObsidian -= blueprint.geodeRobotObsidianCost;
      } else {
        theoreticalObsidianCollectors++; // build more every minute
      }

      // abc - always be collecting
      theoreticalObsidian += theoreticalObsidianCollectors;
      theoreticalGeodes += theoreticalGeodeCollectors;
    }

    return theoreticalGeodes;
  }

  // returns all possible decisions we could make for a given minute
  // returned in vaguely sensible decision order,
  // so DFS this to avoid spending time on dumb decisions
  function possibleNewGameStates(gs: GameState): GameState[] {
    const newStates: GameState[] = [];

    // simulate resource pick ups (after robots have finished the minute)
    const newResources: GameState["resources"] = {
      ore: gs.resources.ore + gs.robots.oreCollectors,
      clay: gs.resources.clay + gs.robots.clayCollectors,
      obsidian: gs.resources.obsidian + gs.robots.obsidianCollectors,
      geodes: gs.resources.geodes + gs.robots.geodeCollectors,
    };

    // try build geode robot
    if (
      gs.resources.ore >= blueprint.geodeRobotOreCost &&
      gs.resources.obsidian >= blueprint.geodeRobotObsidianCost
    ) {
      // if we can, always choose to build a geode-collector
      return [
        {
          minute: gs.minute + 1,
          robots: {
            ...gs.robots,
            geodeCollectors: gs.robots.geodeCollectors + 1,
          },
          resources: {
            ...newResources,
            ore: newResources.ore - blueprint.geodeRobotOreCost,
            obsidian: newResources.obsidian - blueprint.geodeRobotObsidianCost,
          },
        },
      ];
    }

    // try build obsidian robot
    if (
      gs.resources.ore >= blueprint.obsidianRobotOreCost &&
      gs.resources.clay >= blueprint.obsidianRobotClayCost
    ) {
      newStates.push({
        minute: gs.minute + 1,
        robots: {
          ...gs.robots,
          obsidianCollectors: gs.robots.obsidianCollectors + 1,
        },
        resources: {
          ...newResources,
          ore: newResources.ore - blueprint.obsidianRobotOreCost,
          clay: newResources.clay - blueprint.obsidianRobotClayCost,
        },
      });
    }

    // try build clay robot
    if (gs.resources.ore >= blueprint.clayRobotOreCost) {
      newStates.push({
        minute: gs.minute + 1,
        robots: {
          ...gs.robots,
          clayCollectors: gs.robots.clayCollectors + 1,
        },
        resources: {
          ...newResources,
          ore: newResources.ore - blueprint.clayRobotOreCost,
        },
      });
    }

    // try build ore robot
    if (gs.resources.ore >= blueprint.oreRobotOreCost) {
      newStates.push({
        minute: gs.minute + 1,
        robots: {
          ...gs.robots,
          oreCollectors: gs.robots.oreCollectors + 1,
        },
        resources: {
          ...newResources,
          ore: newResources.ore - blueprint.oreRobotOreCost,
        },
      });
    }

    // could also just build nothing
    newStates.push({
      minute: gs.minute + 1,
      resources: newResources,
      robots: gs.robots,
    });

    return newStates;
  }

  // ---------------
  const initialGameState: GameState = {
    minute: 0,
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geodes: 0,
    },
    robots: {
      oreCollectors: 1,
      clayCollectors: 0,
      obsidianCollectors: 0,
      geodeCollectors: 0,
    },
  };

  let numIterations = 0;
  let mostGeodesSeen = 0;

  let gameStatesToTry: GameState[] = [initialGameState];
  while (gameStatesToTry.length) {
    numIterations++;
    const gs = gameStatesToTry.pop()!;

    if (gs.minute === maxTime) {
      // out of time
      const geodesCollected = gs.resources.geodes;
      if (geodesCollected > mostGeodesSeen) {
        // console.log("geodesCollected", geodesCollected, numIterations);
        mostGeodesSeen = geodesCollected;
      }
      continue;
    }

    // bail early if it's not possible to beat our best score with this path
    if (highestOptimisticScoreForState(gs) <= mostGeodesSeen) {
      // 30s with check 1 (always creating more geoids)
      // 62ms with check 2 (extend to simulate obsidian too)

      // give up on this path, not possible to beat our current high score
      continue;
    }

    const newStates = possibleNewGameStates(gs);
    gameStatesToTry = gameStatesToTry.concat(newStates.reverse());
  }

  return mostGeodesSeen;
}

// ---------------------- Part 1 ---------------------------------
{
  let totalQuality = 0;
  console.time("Searching");
  blueprints.forEach((blueprint) => {
    const maxGeoids = maxGeodesForBlueprint(blueprint, 24);
    const qualityLevel = blueprint.blueprintNumber * maxGeoids;
    totalQuality += qualityLevel;
    console.log(
      `Blueprint ${blueprint.blueprintNumber}: ${maxGeoids} geoids (quality: ${qualityLevel})`
    );
  });
  console.timeEnd("Searching");

  console.log("Part 1:", totalQuality);
  equal(totalQuality, 1681);
}

// ---------------------- Part 2 ---------------------------------
{
  let multipliedGeodes = 1;
  console.time("Searching");
  blueprints.slice(0, 3).forEach((blueprint) => {
    const maxGeoids = maxGeodesForBlueprint(blueprint, 32);
    multipliedGeodes *= maxGeoids;
    console.log(`Blueprint ${blueprint.blueprintNumber}: ${maxGeoids} geoids`);
  });
  console.timeEnd("Searching");

  console.log("Part 2:", multipliedGeodes);
  equal(multipliedGeodes, 5394);
}
