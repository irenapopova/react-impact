const fs = require("fs");
const path = require("path");

/**
 * Scan a project folder recursively and return a list of JS/JSX files
 * @param {string} dir - project directory
 * @returns {string[]} - array of file paths
 */
function scanProject(dir) {
  let results = [];
  let list = [];
  try {
    list = fs.readdirSync(dir);
  } catch (error) {
    return results;
  }

  list.forEach((file) => {
    file = path.join(dir, file);
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
      results = results.concat(scanProject(file));
      return;
    }

    if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(file);
    }
  });

  return results;
}

module.exports = { scanProject };
