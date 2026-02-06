# react-impact

**react-impact** is an open-source CLI tool designed to **analyze, track, and improve React build and deployment pipelines**. It helps developers identify which components are affected by code changes, provides reproducible Docker environments, and integrates easily with CI/CD workflows.

> ⚠️ **Work in progress** – actively being developed
# React Impact Demo

This is a sample React project for testing `react-impact`.

## Run the app
```bash
cd examples/react-impact
npm install
npm start


## Features

- Analyze React projects to identify **affected components** after changes
- Generate **reproducible Docker environments** for testing and development
- Integrate with **CI/CD pipelines** for automated builds and testing
- CLI-based interface for quick project insights
- Observability-focused: logs and metrics for builds

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/react-impact.git
cd react-impact
npm install

### Usage
CLI
# Analyze a React project
npx react-impact analyze ./my-project


Future commands will allow more granular operations like impact-tree, report, and dockerize.

Docker
# Build a reproducible Docker environment
docker build -t react-impact ./docker
docker run --rm -v $(pwd)/my-project:/app react-impact analyze /app

### Development

Clone the repository

Install dependencies: npm install

Run tests: npm test

Run CLI locally: node src/cli.js

## Roadmap

 Detailed dependency impact analysis

 Integrate Prometheus metrics for CI/CD pipelines

 Improve Docker reproducibility for different environments

 Add Vue & Vite support

 Publish as an npm package

## Contributing

Contributions are welcome!

Open an issue to suggest improvements or report bugs

Submit a pull request for code changes

## License

This project is licensed under the MIT License – see LICENSE
 for details.

## About the Author

Irena Popova – Full-Stack Developer & DevOps enthusiast
Website: irenapopova.com

Focus: React, Docker, Kubernetes, CI/CD, GitOps, Observability