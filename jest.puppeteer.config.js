module.exports = {
  globalSetup: './tests/browser_tests/setup.js',
  globalTeardown: './tests/browser_tests/teardown.js',
  testEnvironment: './tests/browser_tests/puppeteer_environment.js',
  testMatch: [
    "**/tests/browser_tests/**/*.test.js",
  ]
};