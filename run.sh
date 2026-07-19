#!/bin/bash

# Default test suite to run is 'all' if not specified
TEST_SUITE=${TEST_SUITE:-all}

echo "=============================================="
echo " Starting Hybrid Playwright Automation Suite  "
echo " Environment: ${ENV:-qa}                      "
echo " Browser:     ${BROWSER:-chrome}              "
echo " Headless:    ${HEADLESS:-true}               "
echo " Test Suite:  ${TEST_SUITE}                   "
echo "=============================================="

echo "=== Docker Environment Diagnostics ==="
echo "Playwright version:"
npx playwright --version 2>&1 || echo "Failed to get Playwright version"
echo "Contents of /ms-playwright:"
ls -la /ms-playwright 2>&1 || echo "Failed to list /ms-playwright"
echo "======================================"

# Run the test command corresponding to the selected suite
if [ "$TEST_SUITE" = "web" ]; then
  npm run test:web
elif [ "$TEST_SUITE" = "mWeb" ]; then
  npm run test:mWeb
else
  npm run test:all
fi

# Exit with the status of the test run
exit $?
