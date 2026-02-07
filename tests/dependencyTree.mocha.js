const path = require("path");
const { expect } = require("chai");
const { analyzeDependencies } = require("../src/utils/dependencyTree");

describe("dependencyTree", () => {
  it("links dependents for local imports", () => {
    const fixturesDir = path.join(__dirname, "fixtures-deps");
    const files = [
      path.join(fixturesDir, "A.jsx"),
      path.join(fixturesDir, "B.js"),
      path.join(fixturesDir, "C.js"),
      path.join(fixturesDir, "D.ts"),
      path.join(fixturesDir, "E.tsx"),
    ];

    const result = analyzeDependencies(files);
    const byFile = Object.fromEntries(result.map((row) => [row.file, row]));

    const fileB = path.join(fixturesDir, "B.js");
    const fileC = path.join(fixturesDir, "C.js");
    const fileD = path.join(fixturesDir, "D.ts");

    expect(byFile[fileB].dependents).to.deep.equal([path.join(fixturesDir, "A.jsx")]);
    expect(byFile[fileC].dependents).to.deep.equal([fileB]);
    expect(byFile[fileD].dependents).to.deep.equal([path.join(fixturesDir, "E.tsx")]);
  });
});
