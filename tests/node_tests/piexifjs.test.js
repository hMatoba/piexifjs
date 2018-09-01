const fs = require("fs");
const piexifjs = require('../../dist/piexifjs');

test('"load" returns a object contains IFD -- 1', () => {
  const jpegBinary = fs.readFileSync("./tests/files/r_canon.jpg").toString("binary");
  const exifObj = piexifjs.load(jpegBinary);
  expect(Object.keys(exifObj)).toContain('0th');
});

test('"dump" returns correct value" -- 1', () => {
  const exifObj = {
    '0th': {
      256: 10,
      257:10
    }
  };
  const exifBinary = piexifjs.dump(exifObj);
  const correctBinary = 'Exif\x00\x00MM\x00*\x00\x00\x00\x08\x00\x02\x01\x00\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x01\x01\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x00\x00\x00\x00';
  expect(exifBinary).toBe(correctBinary);
});

test('"load" returns correct value" -- 1', () => {
  const exifBinary = 'Exif\x00\x00MM\x00*\x00\x00\x00\x08\x00\x02\x01\x00\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x01\x01\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x00\x00\x00\x00';
  const correctObj = {
    '0th': {
      256: 10,
      257:10
    }
  };
  const exifObj = piexifjs.load(exifBinary);
  expect(exifObj).toEqual(correctObj);
});

test('round trip "load" and "dump" -- 1', () => {
  const jpegBinary = fs.readFileSync("./tests/files/r_sony.jpg").toString("binary");
  const exifObj1 = piexifjs.load(jpegBinary);
  const exifBinary = piexifjs.dump(exifObj1);
  const exifObj2 = piexifjs.load(exifBinary);

  // remove pointer values
  delete exifObj1['0th'][34665];
  delete exifObj2['0th'][34665];
  delete exifObj1['1st'][513];
  delete exifObj2['1st'][513];
  delete exifObj1['1st'][514];
  delete exifObj2['1st'][514];
  delete exifObj1['Exif'][40965];
  delete exifObj2['Exif'][40965];

  expect(exifObj1).toEqual(exifObj2);
});

test('success remove -- 1', () => {
  const jpegBinary = fs.readFileSync("./tests/files/r_pana.jpg").toString("binary");
  const exifObj = piexifjs.load(jpegBinary);
  expect(Object.keys(exifObj)).toContain('0th');
  const jpegBinaryRemovedExif = piexifjs.remove(jpegBinary);
  const exifObjRemovedExif = piexifjs.load(jpegBinaryRemovedExif);
  expect(exifObjRemovedExif).toEqual({});
});

test('success insert -- 1', () => {
  const jpegBinary = fs.readFileSync("./tests/files/noexif.jpg").toString("binary");
  const exifBinary = 'Exif\x00\x00MM\x00*\x00\x00\x00\x08\x00\x02\x01\x00\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x01\x01\x00\x04\x00\x00\x00\x01\x00\x00\x00\n\x00\x00\x00\x00';
  const jpegBinaryExifInsert = piexifjs.insert(exifBinary, jpegBinary);
  throw new Error('Not "expect"ed output. Implement!');
});
