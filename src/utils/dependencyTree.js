const fs = require("fs");
const path = require("path");

function extractImportSpecifiers(source) {
  const specs = new Set();
  const importFromRegex = /import\s+[^;]*?from\s+["']([^"']+)["']/g;
  const importOnlyRegex = /import\s+["']([^"']+)["']/g;
  const requireRegex = /require\(\s*["']([^"']+)["']\s*\)/g;
  const dynamicImportRegex = /import\(\s*["']([^"']+)["']\s*\)/g;

  let match;
  while ((match = importFromRegex.exec(source))) specs.add(match[1]);
  while ((match = importOnlyRegex.exec(source))) specs.add(match[1]);
  while ((match = requireRegex.exec(source))) specs.add(match[1]);
  while ((match = dynamicImportRegex.exec(source))) specs.add(match[1]);

  return Array.from(specs);
}

function resolveImportPath(fromFile, specifier) {
  if (!specifier.startsWith(".") && !specifier.startsWith("..")) return null;

  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

/**
 * Basic dependency analysis
 * Builds a file-level dependency graph for local JS/JSX imports
 * @param {string[]} files
 * @returns {object[]} - analysis result
 */
function analyzeDependencies(files) {
  const fileSet = new Set(files.map((f) => path.resolve(f)));
  const dependenciesByFile = new Map();
  const dependentsByFile = new Map();

  for (const file of fileSet) {
    let source = "";
    try {
      source = fs.readFileSync(file, "utf8");
    } catch (error) {
      dependenciesByFile.set(file, []);
      continue;
    }

    const specs = extractImportSpecifiers(source);
    const deps = [];

    for (const spec of specs) {
      const resolved = resolveImportPath(file, spec);
      if (resolved && fileSet.has(resolved)) {
        deps.push(resolved);
      }
    }

    dependenciesByFile.set(file, deps);
  }

  for (const [file, deps] of dependenciesByFile.entries()) {
    for (const dep of deps) {
      const current = dependentsByFile.get(dep) || [];
      current.push(file);
      dependentsByFile.set(dep, current);
    }
  }

  return Array.from(fileSet).map((file) => ({
    file,
    dependencies: dependenciesByFile.get(file) || [],
    dependents: dependentsByFile.get(file) || [],
    affectedComponents: dependentsByFile.get(file) || [],
  }));
}

module.exports = { analyzeDependencies, extractImportSpecifiers, resolveImportPath };
