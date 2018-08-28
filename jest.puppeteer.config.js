module.exports = {
  globalSetup: './browser_tests/setup.js',
  globalTeardown: './browser_tests/teardown.js',
  testEnvironment: './browser_tests/puppeteer_environment.js',
  testMatch: [
    "**/browser_tests/**/*.test.js",
  ]
};