process.env.CHROME_BIN = require('puppeteer').executablePath();
const createTestCafe = require('testcafe');

let testcafe = null;
createTestCafe('localhost', 1337, 1338)
  .then(tc => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src(['test/e2e-test/index.fixture.js'])
      .browsers(['chrome:headless'])
      .run();
  })
  .then(failedCount => {
    console.log('Tests failed: ' + failedCount); // eslint-disable-line
    testcafe.close();
  })
  .catch(err => console.log(err)); // eslint-disable-line
