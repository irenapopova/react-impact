#!/usr/bin/env node

const path = require("path");
const { scanProject } = require("./utils/fileScanner");
const { analyzeDependencies } = require("./utils/dependencyTree");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: npx react-impact analyze <path-to-project>");
  process.exit(1);
}

const command = args[0];
const projectPath = args[1] ? path.resolve(args[1]) : process.cwd();

if (command === "analyze") {
  console.log(`Analyzing project at ${projectPath} ...`);
  const files = scanProject(projectPath);
  const result = analyzeDependencies(files);
  console.log("Analysis Result:", result);
} else {
  console.log(`Unknown command: ${command}`);
  console.log("Available commands: analyze");
}
