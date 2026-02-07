const path = require("path");
const { execFileSync } = require("child_process");

test("CLI supports --format text output", () => {
  const cliPath = path.join(__dirname, "..", "src", "cli.js");
  const fixturesDir = path.join(__dirname, "fixtures-deps");

  const output = execFileSync("node", [cliPath, "analyze", fixturesDir, "--format", "text"], {
    encoding: "utf8",
  });

  expect(output).toContain("deps:");
  expect(output).toContain("dependents:");
});
