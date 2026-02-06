const fs = require("fs");
const path = require("path");

/**
 * Scan a project folder recursively and return a list of JS/JSX files
 * @param {string} dir - project directory
 * @returns {string[]} - array of file paths
 */
function scanProject(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanProject(file));
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      results.push(file);
    }
  });

  return results;
}

module.exports = { scanProject };
