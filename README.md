# react-impact

react-impact is a lightweight CLI prototype for scanning a React project and producing a first-pass dependency impact report. It is intentionally minimal right now: it walks a directory, collects `.js` and `.jsx` files, and outputs a placeholder analysis structure. The goal is to evolve this into a real impact-analysis tool for React build and deployment workflows.

## Status

This repository is a work in progress. The current CLI focuses on file discovery and a stub analysis pipeline. The results are not yet used to determine real component impact.

## What It Does Today

- Recursively scans a project directory for `.js` and `.jsx` files
- Builds a basic local import dependency graph (ESM `import`, CommonJS `require`)
- Reports `dependencies`, `dependents`, and a first-pass `affectedComponents` list
- Provides a simple CLI interface for the `analyze` command

## Quick Start

Prerequisites:

- Node.js (no external dependencies required)

Run the CLI locally:

```bash
node src/cli.js analyze /path/to/your/react-project
```

If you omit the path, it uses the current working directory:

```bash
node src/cli.js analyze
```

Optional output formats:

```bash
node src/cli.js analyze /path/to/project --format json
node src/cli.js analyze /path/to/project --format text
```

Write output to a file:

```bash
node src/cli.js analyze /path/to/project --format json --output report.json
```

Change-set mode (show only impacted files based on a list of changed files):

```bash
node src/cli.js analyze /path/to/project --changed src/pages/index.js
```

Tip: use `--format text` for a readable summary with relative paths and separate Changed/Impacted sections.

Example output (shape):

```text
Analyzing project at /path/to/project ...
Analysis Result: [ { file: '/path/to/project/src/App.jsx', dependencies: [...], dependents: [...], affectedComponents: [...] }, ... ]
```

## Project Structure

- `src/cli.js` CLI entry point and command routing
- `src/utils/fileScanner.js` recursive file discovery
- `src/utils/dependencyTree.js` local import dependency analysis
- `tests/` Jest + Mocha test suites and fixtures

## Testing

Run all tests (Jest + Mocha):

```bash
npm test
```

Jest only:

```bash
npm run test:jest
```

Mocha only:

```bash
npm run test:mocha
```

## CI

GitHub Actions runs the test suite on pushes and pull requests to `main`.

## Docker

Build the image:

```bash
docker build -t react-impact .
```

Run analysis against a local project by mounting it into the container:

```bash
docker run --rm -v /absolute/path/to/your/react-project:/project react-impact analyze /project
```

## Roadmap

- Real dependency graph construction (imports, exports, and component usage)
- Impact propagation and change-set reporting
- JSON and human-readable report formats
- Optional CI-friendly output modes
- Dockerized environment for consistent analysis

## Contributing

Contributions are welcome. If you want to help, open an issue with a proposal or submit a focused pull request. Since the current implementation is intentionally minimal, please describe the problem you are solving and how it fits the roadmap.

## License

MIT. See `LICENSE`.

## About the Author

Irena Popova – Full-Stack Developer & DevOps enthusiast  
Website: irenapopova.com  
Focus: React, Docker, Kubernetes, CI/CD, GitOps, Observability
