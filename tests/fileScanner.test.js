const path = require("path");
const { scanProject } = require("../src/utils/fileScanner");

test("scanProject finds js/jsx files in a folder", () => {
  const fixturesDir = path.join(__dirname, "fixtures");
  const files = scanProject(fixturesDir);
  expect(files.some((f) => f.endsWith("App.jsx"))).toBe(true);
  expect(files.some((f) => f.endsWith("Utils.js"))).toBe(true);
  expect(files.some((f) => f.endsWith("Component.tsx"))).toBe(true);
  expect(files.some((f) => f.endsWith("README.txt"))).toBe(false);
  expect(files.some((f) => f.endsWith("Hidden.js"))).toBe(false);
});
