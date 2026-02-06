/**
 * Dummy dependency analysis
 * For demonstration, just lists file names
 * Replace with real dependency analysis later
 * @param {string[]} files
 * @returns {object} - analysis result
 */
function analyzeDependencies(files) {
  const result = files.map((f) => ({
    file: f,
    affectedComponents: [], // placeholder
  }));
  return result;
}

module.exports = { analyzeDependencies };
