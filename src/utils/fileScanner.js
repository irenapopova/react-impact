const fs = require("fs");
const path = require("path");

function loadIgnorePatterns(rootDir, options = {}) {
  const defaultPatterns = ["node_modules", ".git", ".cache", "public", "venv", "__pycache__"];
  const useDefaults = options.useDefaults !== false;
  const ignorePath = path.join(rootDir, ".react-impactignore");
  if (!fs.existsSync(ignorePath)) return useDefaults ? defaultPatterns : [];

  const raw = fs.readFileSync(ignorePath, "utf8");
  const custom = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
  const combined = useDefaults ? [...defaultPatterns, ...custom] : custom;
  return Array.from(new Set(combined));
}

function shouldIgnore(filePath, rootDir, patterns) {
  if (!patterns || patterns.length === 0) return false;

  const relative = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const segments = relative.split("/");

  return patterns.some((pattern) => {
    const normalized = pattern.replace(/\\/g, "/").replace(/\/+$/, "");
    if (normalized.includes("/")) {
      return relative === normalized || relative.startsWith(`${normalized}/`);
    }
    return segments.includes(normalized);
  });
}

/**
 * Scan a project folder recursively and return a list of JS/JSX files
 * @param {string} dir - project directory
 * @returns {string[]} - array of file paths
 */
function scanProject(dir, options = {}) {
  const rootDir = options.rootDir || dir;
  const ignorePatterns = options.ignorePatterns || loadIgnorePatterns(rootDir, options);
  let results = [];
  let list = [];
  try {
    list = fs.readdirSync(dir);
  } catch (error) {
    return results;
  }

  list.forEach((file) => {
    file = path.join(dir, file);
    if (shouldIgnore(file, rootDir, ignorePatterns)) return;

    let stat;
    try {
      stat = fs.lstatSync(file);
    } catch (error) {
      return;
    }

    if (stat.isSymbolicLink()) return;

    if (stat.isDirectory()) {
      const base = path.basename(file);
      if (base === "node_modules" || base === ".git" || base === "venv" || base === "__pycache__") {
        return;
      }
      results = results.concat(scanProject(file, { rootDir, ignorePatterns }));
      return;
    }

    if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(file);
    }
  });

  return results;
}

module.exports = { scanProject };
