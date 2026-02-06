const path = require("path");
const { analyzeDependencies } = require("../src/utils/dependencyTree");

test("analyzeDependencies builds dependency graph for local imports", () => {
  const fixturesDir = path.join(__dirname, "fixtures-deps");
  const files = [
    path.join(fixturesDir, "A.jsx"),
    path.join(fixturesDir, "B.js"),
    path.join(fixturesDir, "C.js"),
  ];

  const result = analyzeDependencies(files);
  const byFile = Object.fromEntries(result.map((row) => [row.file, row]));

  const fileA = path.join(fixturesDir, "A.jsx");
  const fileB = path.join(fixturesDir, "B.js");
  const fileC = path.join(fixturesDir, "C.js");

  expect(byFile[fileA].dependencies).toEqual([fileB]);
  expect(byFile[fileB].dependencies).toEqual([fileC]);
  expect(byFile[fileC].dependencies).toEqual([]);

  expect(byFile[fileB].dependents).toEqual([fileA]);
  expect(byFile[fileC].dependents).toEqual([fileB]);
});
