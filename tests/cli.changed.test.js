const path = require("path");
const { execFileSync } = require("child_process");

test("CLI supports --changed to filter impacted files", () => {
  const cliPath = path.join(__dirname, "..", "src", "cli.js");
  const fixturesDir = path.join(__dirname, "fixtures-deps");
  const changedFile = path.join(fixturesDir, "C.js");

  const output = execFileSync("node", [
    cliPath,
    "analyze",
    fixturesDir,
    "--format",
    "text",
    "--changed",
    changedFile,
  ], { encoding: "utf8" });

  expect(output).toContain("Changed:");
  expect(output).toContain("Impacted:");
  expect(output).toContain("C.js");
  expect(output).toContain("B.js");
  expect(output).toContain("A.jsx");
});
