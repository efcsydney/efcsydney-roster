process.env.CHROME_BIN = require('puppeteer').executablePath();
const createTestCafe = require('testcafe');
const util = require('util');
const glob = util.promisify(require('glob'));

let testcafe = null;
createTestCafe('localhost', 1337, 1338)
  .then(async tc => {
    testcafe = tc;
    const runner = testcafe.createRunner();
    const files = await glob('test/e2e-test/*.fixture.js');

    return runner
      .src(files)
      .browsers(['chrome'])
      .run();
  })
  .then(failedCount => {
    console.log('Tests failed: ' + failedCount); // eslint-disable-line
    testcafe.close();
  })
  .catch(err => console.log(err)); // eslint-disable-line
