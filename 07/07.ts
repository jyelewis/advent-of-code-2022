import * as fs from "fs";
import assert from "node:assert";

interface Command {
  command: string;
  arg: string;
  output: string[];
}

interface File {
  name: string;
  size: number;
}

class Directory {
  public contents = new Map<string, File | Directory>();

  public constructor(public name: string) {
    this.name = name;
  }

  public get size(): number {
    // sum size of all sub directories & files
    return Array.from(this.contents.values())
      .map((x) => x.size)
      .reduce((a, b) => a + b, 0);
  }

  public addFile(inputStr: string) {
    const [fileSizeStr, name] = inputStr.split(" ");
    if (this.contents.has(name)) {
      // already seen this file, ignore
      return;
    }

    this.contents.set(name, {
      name,
      size: parseInt(fileSizeStr),
    });
  }

  public addDirectory(directoryName: string) {
    if (this.contents.has(directoryName)) {
      // already seen this directory, ignore
      return this.contents.get(directoryName)! as Directory;
    }

    const newSubDir = new Directory(directoryName);
    this.contents.set(directoryName, newSubDir);
    return newSubDir;
  }
}
// -----------

const input = fs.readFileSync(__dirname + "/input.txt").toString();

// parse input into an array of commands
// the first element of each command is hte input command, the rest of the elements is the output
const commands: Command[] = input
  .split("$")
  .filter((x) => x) // remove empties
  .map((cmdStr) => {
    // parse command strings
    const [commandAndArgs, ...output] = cmdStr
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x);
    const [command, arg] = commandAndArgs.split(" ");
    return {
      command,
      arg,
      output,
    };
  });

function runCommands(commands: Command[]) {
  // keep track of machine state as we run this command
  const knownDirectories = new Map<string, Directory>([
    ["/", new Directory("ROOT")],
  ]);
  let currentPath: string[] = [];

  for (const command of commands) {
    switch (command.command) {
      case "cd": {
        // keep track of where we are in the machine
        if (command.arg === "..") {
          // move back up 1 directory
          currentPath.pop();
          break;
        }

        if (command.arg.startsWith("/")) {
          // move back to the root
          currentPath = command.arg.split("/").filter((x) => x);
          break;
        }

        currentPath.push(command.arg);

        break;
      }
      case "ls": {
        // gotta deal with the root dir too
        const currentPathString =
          currentPath.length === 0 ? "/" : `/${currentPath.join("/")}/`;

        const currentDirectory = knownDirectories.get(currentPathString);
        if (!currentDirectory) {
          throw new Error("Currently in an unknown directory");
        }

        for (const lsOutput of command.output) {
          if (lsOutput.startsWith("dir")) {
            // new directory possibly found, make sure we've catalogued it
            const directoryName = lsOutput.split(" ")[1]!;
            const subDirPath = `${currentPathString}${directoryName}/`;

            const newDirectory = currentDirectory.addDirectory(directoryName);
            knownDirectories.set(subDirPath, newDirectory);

            continue;
          }

          // new file possibly found, make sure we've catalogued it
          currentDirectory.addFile(lsOutput);
        }

        break;
      }
      default: {
        throw new Error(`Unknown command ${command}`);
      }
    }
  }

  return knownDirectories;
}

const knownDirectories = runCommands(commands);

// part 1
const totalSizes = Array.from(knownDirectories.values())
  .map((dir) => dir.size)
  .filter((size) => size <= 100000)
  .reduce((a, b) => a + b, 0);

console.log("Part 1: totalSizes", totalSizes);
assert(totalSizes === 1783610);

// part 2
const totalFileSystemSize = 70000000;
const requiredFreeSpace = 30000000;
const currentDiskUsed = knownDirectories.get("/")!.size;
const freeDiskSpace = totalFileSystemSize - currentDiskUsed;

const minimumDataToDelete = requiredFreeSpace - freeDiskSpace;

const optionsToDelete = Array.from(knownDirectories.values())
  .map((dir) => dir.size)
  .filter((size) => size >= minimumDataToDelete);

const smallestOptionForDeletion = optionsToDelete.sort((a, b) => a - b)[0];
console.log("Part 2: smallestOptionForDeletion", smallestOptionForDeletion);
assert(smallestOptionForDeletion === 4370655);
