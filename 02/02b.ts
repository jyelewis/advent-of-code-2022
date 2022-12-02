import * as fs from "fs";

enum Play {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum Goal {
  Lose,
  Draw,
  Win,
}

const playBeatsPlay: Record<Play, Play> = {
  [Play.Rock]: Play.Scissors,
  [Play.Paper]: Play.Rock,
  [Play.Scissors]: Play.Paper,
};
const playLosesToPlay: Record<Play, Play> = {
  [Play.Rock]: Play.Paper,
  [Play.Paper]: Play.Scissors,
  [Play.Scissors]: Play.Rock,
};

function charToPlay(char: string): Play {
  const play = {
    A: Play.Rock,
    B: Play.Paper,
    C: Play.Scissors,
  }[char];

  if (play === undefined) {
    throw new Error(`Invalid play char '${char}'`);
  }

  return play;
}

function charToGoal(char: string): Goal {
  const goal = {
    X: Goal.Lose,
    Y: Goal.Draw,
    Z: Goal.Win,
  }[char];

  if (goal === undefined) {
    throw new Error(`Invalid goal char '${char}'`);
  }

  return goal;
}

function scoreForGame(theirPlay: Play, myPlay: Play): number {
  if (myPlay === theirPlay) {
    // draw
    // 3 base points + play points
    return 3 + myPlay;
  }

  if (playBeatsPlay[myPlay] === theirPlay) {
    // win
    // 6 base points + play points
    return 6 + myPlay;
  }

  // loss
  // 0 base points + play points
  return 0 + myPlay;
}

function requiredPlayForGoal(theirPlay: Play, goal: Goal): Play {
  switch (goal) {
    case Goal.Draw:
      // play the same as them
      return theirPlay;
    case Goal.Lose:
      // find the play that their play would beat, and play that to lose
      return playBeatsPlay[theirPlay];
    case Goal.Win:
      // find what we need to play, in order to beat their play
      return playLosesToPlay[theirPlay];
  }
}

function rowToGameScore(row: string): number {
  // split row and decode
  const [theirPlayStr, goalStr] = row.split(" ");
  const theirPlay = charToPlay(theirPlayStr);
  const goal = charToGoal(goalStr);

  // work out what we need to play, in order to achieve 'goal'
  const myPlay = requiredPlayForGoal(theirPlay, goal);

  // simulate game to get score
  return scoreForGame(theirPlay, myPlay);
}

// --------------------

const input = fs.readFileSync(__dirname + "/input.txt").toString();

const gameScores = input
  .split("\n") // split each game by new line
  .filter((x) => x) // drop empty lines
  .map(rowToGameScore); // parse game row & calculate score

// sum all game scores
const totalGameScores = gameScores.reduce((x, y) => x + y, 0);

console.log("Total game scores: ", totalGameScores);
