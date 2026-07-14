# Hybrid Playwright E2E Automation Framework (JS/TS Showcase)

This is a modern, high-performance E2E automation framework designed for web applications. It uses a **Hybrid Structure** to showcase robust engineering practices for GitHub collections:
- **TypeScript (TS)** for storing Page Object Model (POM) files, element locators (Object Repositories), and page methods/actions.
- **JavaScript (JS)** for writing clean and readable test cases.
- **Mocha** & **Chai** for test suite lifecycle and assertions.
- **Playwright** as the core browser automation engine.
- **Mochawesome** for rich, interactive, and shareable HTML reports.
- **Docker** support to package and run the entire suite in containerized environments.
- **GitHub Actions** workflows for CI/CD integration.

---

## Key Features

1. **Multi-Platform Sections**:
   - **Web**: Verification of standard desktop web applications (e.g. element additions/removals).
   - **WebLR (Living Room)**: Tests focusing on 10-foot/TV web applications, demonstrating key-based focal navigations and D-pad simulations (Arrow Keys, Tab, Enter).
   - **MWeb (Mobile Web)**: Simulates mobile browser viewports, user agents, and touchscreen environments (e.g. mobile form logins).
2. **Dynamic TS Compilation**: Enables JS test specs to dynamically import/require TypeScript page objects on-the-fly using `ts-node`.
3. **Robust Action Wrapper**: Exposes `WebActions.ts` wrapping core Playwright APIs with built-in logging, error-handling, and automatic screenshots.
4. **Rich Reporting**: Automatically compiles report statistics and exports interactive HTML pages and JSON summaries.
5. **Dockerization**: Ready to be built as a Docker container, running headlessly in CI or localized testing pipelines.

---

## Directory Structure

```
playwright-hybrid-framework/
├── .github/
│   └── workflows/
│       ├── run-tests-docker.yml        # CI pipeline running tests inside Docker
│       └── run-tests-local.yml         # CI pipeline running tests on host runner
├── src/
│   ├── browsers/
│   │   ├── BrowserFactory.ts           # Launches browser contexts and device emulations
│   │   └── browser_options.json        # Launch arguments and options
│   ├── config/
│   │   └── config.ts                   # Environment configurations and URLs
│   ├── libs/
│   │   └── WebActions.ts               # Action methods wrapping Playwright API
│   ├── logger/
│   │   └── logger.ts                   # Winston console logger
│   └── pageFactory/
│       ├── objectRepository/           # Element locator class definitions
│       │   ├── web/
│       │   │   └── SearchPageObjects.ts
│       │   ├── webLR/
│       │   │   └── WatchPageObjects.ts
│       │   └── mWeb/
│       │       └── NavigationObjects.ts
│       └── pageRepository/             # Page actions invoking WebActions
│           ├── web/
│           │   └── SearchPage.ts
│           ├── webLR/
│           │   └── WatchPage.ts
│           └── mWeb/
│               └── NavigationPage.ts
├── tests/                              # Test spec suites
│   ├── web/
│   │   └── search.spec.js              # Desktop E2E tests
│   ├── webLR/
│   │   └── livingroom.spec.js          # TV / keypress-based simulation tests
│   └── mWeb/
│       └── mobile.spec.js              # Mobile web layout tests
├── package.json                        # Scripts and npm dependencies
├── tsconfig.json                       # TS configuration
├── Dockerfile                          # Docker image definition
├── run.sh                              # Docker entrypoint run script
└── README.md                           # Main documentation file
```

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed.

1. Clone the repository and navigate to the project directory:
   ```bash
   cd playwright-hybrid-framework
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browser binaries:
   ```bash
   npx playwright install
   ```

---

## Running Tests Locally

You can run individual suites or the entire project using npm scripts:

- **Run Web (Desktop) Tests**:
  ```bash
  npm run test:web
  ```
- **Run WebLR (Keyboard/TV) Tests**:
  ```bash
  npm run test:webLR
  ```
- **Run MWeb (Mobile Layout) Tests**:
  ```bash
  npm run test:mWeb
  ```
- **Run All Test Suites**:
  ```bash
  npm run test:all
  ```

*Note: By default, tests run headlessly. Set `HEADLESS=false` in your terminal environment if you wish to run them in headed mode.*

---

## Viewing Test Reports

Execution reports are automatically compiled and saved in the `reports/` folder:
- **Web Reports**: `reports/web/report.html`
- **WebLR Reports**: `reports/webLR/report.html`
- **MWeb Reports**: `reports/mWeb/report.html`

Open any `report.html` file in your preferred web browser to view detailed visual logs, pass/fail metrics, and execution times.

---

## Running in Docker

You can run the entire automation pipeline inside a Docker container without installing local Node or browser binaries:

1. **Build the Docker Image**:
   ```bash
   docker build -t playwright-tests:latest .
   ```

2. **Run All Tests inside the Container**:
   ```bash
   docker run --name test-run -e TEST_SUITE=all playwright-tests:latest
   ```
   *You can customize test suites by setting `TEST_SUITE` to `web`, `webLR`, or `mWeb`.*

3. **Export Reports from the Container**:
   After the tests complete, copy the generated reports to your host machine:
   ```bash
   docker cp test-run:/app/reports ./reports-export
   ```

4. **Cleanup Container**:
   ```bash
   docker rm test-run
   ```

---

## CI/CD Pipeline (GitHub Actions)

Two GitHub Actions pipelines are included in the `.github/workflows` directory:
- **Local Runner Workflow (`run-tests-local.yml`)**: Installs dependencies and runs Mocha tests directly on GitHub's Ubuntu runner.
- **Dockerized Workflow (`run-tests-docker.yml`)**: Builds the Docker image, executes tests in a container, and extracts/uploads HTML reports as build artifacts.
