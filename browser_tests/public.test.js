const piexifjs = require('../dist/piexifjs');

const timeout = 5000

describe(
  '/ (Home Page)',
  () => {
    let page
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
    }, timeout)

    afterAll(async () => {
      await page.close()
    })

    it('should load without error', async () => {
      await page.addScriptTag({
        path: "./dist/piexifjs.js"
      });
      const val = await page.evaluate(() => {
        piexifjs.load;
        return "xx";
      })
      expect(val).toBe("xx");
    })
  },
  timeout
)