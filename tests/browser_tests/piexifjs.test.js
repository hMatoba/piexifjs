const fs = require('fs');
const nodePiexif = require('../../dist/piexif');

const timeout = 5000;
const jpegBinary = fs.readFileSync("./tests/files/r_canon.jpg").toString("binary");
const piexifPath = '../../dist/piexif.js';

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
  const nodeOutput = nodePiexif.load(jpegBinary);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  
  const browserOutput = await page.evaluate((jpeg) => {
      return piexif.load(jpeg);
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
  const nodeOutput = nodePiexif.dump(exif);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((exifObj) => {
      return piexif.dump(exifObj);
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
  const exifBinary = nodePiexif.dump(exif);
  const nodeOutput = nodePiexif.insert(exifBinary, jpegBinary);;
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((exif, jpeg) => {
      return piexif.insert(exif, jpeg);
    },
    exifBinary,
    jpegBinary
  );
  expect(browserOutput).toEqual(nodeOutput);
});

it('should be same output from remove on node and browser ', async () => {
  const nodeOutput = nodePiexif.remove(jpegBinary);
  await page.addScriptTag({
    path: require.resolve(piexifPath)
  });
  const browserOutput = await page.evaluate((jpeg) => {
      return piexif.remove(jpeg);
    },
    jpegBinary
  );
  expect(browserOutput).toEqual(nodeOutput);
});
