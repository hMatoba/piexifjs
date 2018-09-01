const fs = require('fs');
const nodePiexifjs = require('../../dist/piexifjs');

const timeout = 5000;
const jpegBinary = fs.readFileSync("./tests/files/r_canon.jpg").toString("binary");
const piexifPath = '../../dist/piexifjs.js';

let page;
beforeAll(async () => {
  page = await global.__BROWSER__.newPage()
}, timeout);

afterAll(async () => {
  await page.close()
});

it('test to check running puppeteer', async () => {
  await page.addScriptTag({
    content: "const x = 1 + 1;"
  });
});

it('should be same output from load on node and browser ', async () => {
  const nodeOutput = nodePiexifjs.load(jpegBinary);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  
  const browserOutput = await page.evaluate((jpeg) => {
      return piexifjs.load(jpeg);
    },
    jpegBinary
  );
  expect(browserOutput).toEqual(nodeOutput);
});

it('should be same output from dump on node and browser ', async () => {
  const exif = {
    '0th': {
      '256': 10,
      '257': 10
    }
  };
  const nodeOutput = nodePiexifjs.dump(exif);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((exifObj) => {
      return piexifjs.dump(exifObj);
    },
    exif
  );
  expect(browserOutput).toEqual(nodeOutput);
});

it('should be same output from insert on node and browser ', async () => {
  const exif = {
    '0th': {
      '256': 10,
      '257': 10
    }
  };
  const exifBinary = nodePiexifjs.dump(exif);
  const nodeOutput = nodePiexifjs.insert(exifBinary, jpegBinary);;
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((exif, jpeg) => {
      return piexifjs.insert(exif, jpeg);
    },
    exifBinary,
    jpegBinary
  );
  expect(browserOutput).toEqual(nodeOutput);
});

it('should be same output from remove on node and browser ', async () => {
  const nodeOutput = nodePiexifjs.remove(jpegBinary);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((jpeg) => {
      return piexifjs.remove(jpeg);
    },
    jpegBinary
  );
  expect(browserOutput).toEqual(nodeOutput);
});
