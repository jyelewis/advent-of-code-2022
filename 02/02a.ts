import * as fs from "fs";

enum Play {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

const playBeatsPlay: Record<Play, Play> = {
  [Play.Rock]: Play.Scissors,
  [Play.Paper]: Play.Rock,
  [Play.Scissors]: Play.Paper,
};

function charToPlay(char: string): Play {
  const play = {
    A: Play.Rock,
    B: Play.Paper,
    C: Play.Scissors,
    X: Play.Rock,
    Y: Play.Paper,
    Z: Play.Scissors,
  }[char];

  if (play === undefined) {
    throw new Error(`Invalid play char '${char}'`);
  }

  return play;
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

function rowToGameScore(row: string): number {
  // split row and decode plays
  const [theirPlay, myPlay] = row.split(" ").map(charToPlay);

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
