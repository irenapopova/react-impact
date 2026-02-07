#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { scanProject } = require("./utils/fileScanner");
const { analyzeDependencies } = require("./utils/dependencyTree");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: npx react-impact analyze <path-to-project>");
  process.exit(1);
}

const command = args[0];
const projectPath = args[1] ? path.resolve(args[1]) : process.cwd();
const outputIndex = args.indexOf("--output");
const formatIndex = args.indexOf("--format");
const changedIndex = args.indexOf("--changed");
const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;
const format = formatIndex !== -1 ? args[formatIndex + 1] : "json";

function collectChangedArgs(allArgs, startIndex) {
  if (startIndex === -1) return [];
  const collected = [];
  for (let i = startIndex + 1; i < allArgs.length; i += 1) {
    const value = allArgs[i];
    if (value.startsWith("--")) break;
    collected.push(value);
  }
  return collected;
}

function buildImpactSet(resultRows, changedFiles) {
  const byFile = new Map(resultRows.map((row) => [row.file, row]));
  const queue = [...changedFiles];
  const impacted = new Set();

  while (queue.length > 0) {
    const file = queue.shift();
    if (!file || impacted.has(file)) continue;
    impacted.add(file);

    const row = byFile.get(file);
    if (!row || !row.dependents) continue;
    for (const dependent of row.dependents) {
      if (!impacted.has(dependent)) queue.push(dependent);
    }
  }

  return impacted;
}

function resolveChangedFiles(changedArgs, scannedFiles) {
  const fileSet = new Set(scannedFiles);
  const resolved = [];

  for (const arg of changedArgs) {
    const absolute = path.resolve(arg);
    if (fileSet.has(absolute)) {
      resolved.push(absolute);
      continue;
    }

    const candidates = [
      absolute,
      `${absolute}.js`,
      `${absolute}.jsx`,
      `${absolute}.ts`,
      `${absolute}.tsx`,
      path.join(absolute, "index.js"),
      path.join(absolute, "index.jsx"),
      path.join(absolute, "index.ts"),
      path.join(absolute, "index.tsx"),
    ];

    for (const candidate of candidates) {
      if (fileSet.has(candidate)) {
        resolved.push(candidate);
        break;
      }
    }
  }

  return resolved;
}

function formatResult(result, fmt, options = {}) {
  if (fmt === "text") {
    const {
      rootDir,
      changedFiles = [],
      impactedSet = null,
      byFile = null,
    } = options;

    const rel = (filePath) => (rootDir ? path.relative(rootDir, filePath) : filePath);
    const getRow = (filePath) => (byFile ? byFile.get(filePath) : null);

    const headerLines = [];
    if (changedFiles.length > 0 && impactedSet) {
      const impactedCount = impactedSet.size;
      const changedCount = changedFiles.length;
      const dependentsCount = Math.max(impactedCount - changedCount, 0);
      headerLines.push(`Impacted files: ${impactedCount} (changed: ${changedCount}, dependents: ${dependentsCount})`);
      headerLines.push("");
    }

    const formatRow = (filePath) => {
      const row = getRow(filePath);
      const deps = row && row.dependencies ? row.dependencies.length : 0;
      const depsBy = row && row.dependents ? row.dependents.length : 0;
      return `${rel(filePath)} | deps:${deps} | dependents:${depsBy}`;
    };

    if (changedFiles.length > 0 && impactedSet) {
      const impactedOnly = Array.from(impactedSet).filter((file) => !changedFiles.includes(file));
      const lines = [
        ...headerLines,
        "Changed:",
        ...changedFiles.map(formatRow),
        "",
        "Impacted:",
        ...impactedOnly.map(formatRow),
      ];
      return lines.join("\n");
    }

    return result
      .map((row) => formatRow(row.file))
      .join("\n");
  }
  return JSON.stringify(result, null, 2);
}

if (command === "analyze") {
  console.log(`Analyzing project at ${projectPath} ...`);
  const files = scanProject(projectPath);
  const result = analyzeDependencies(files);
  const changedArgs = collectChangedArgs(args, changedIndex);
  const changedFiles = resolveChangedFiles(changedArgs, files);
  const impactedSet = buildImpactSet(result, changedFiles);
  const finalResult = changedFiles.length > 0
    ? result.filter((row) => impactedSet.has(row.file))
    : result;

  const byFile = new Map(result.map((row) => [row.file, row]));
  const formatted = formatResult(finalResult, format, {
    rootDir: projectPath,
    changedFiles,
    impactedSet,
    byFile,
  });

  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), formatted, "utf8");
    console.log(`Analysis written to ${path.resolve(outputPath)}`);
  } else {
    console.log("Analysis Result:");
    console.log(formatted);
  }
} else {
  console.log(`Unknown command: ${command}`);
  console.log("Available commands: analyze");
}
