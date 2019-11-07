import * as _utils from './utils';

// Hacky? Yep, but sometimes you gotta do what you gotta do
export { Types, IExif, IExifElement } from './interfaces';
export { TagValues } from './constants';
export { GPSHelper } from './helper';
export { ValueConvertError } from './exceptions';

import { Types, IExif, IExifElement } from './interfaces';
import { TagValues } from './constants';

export const version = '2.0.0b';

export const remove = (imageBinary: string): string => {
  let bbase64Encoded = false;
  if (imageBinary.slice(0, 2) == '\xff\xd8') {
  } else if (
    imageBinary.slice(0, 23) == 'data:image/jpeg;base64,' ||
    imageBinary.slice(0, 22) == 'data:image/jpg;base64,'
  ) {
    imageBinary = _utils.atob(imageBinary.split(',')[1]);
    bbase64Encoded = true;
  } else {
    throw new Error('Given data is not jpeg.');
  }

  const segments = _utils.splitIntoSegments(imageBinary);
  const newSegments = segments.filter(function(segment: string) {
    return !(
      segment.slice(0, 2) == '\xff\xe1' &&
      segment.slice(4, 10) == 'Exif\x00\x00'
    );
  });

  let newBinary = newSegments.join('');
  if (bbase64Encoded) {
    newBinary = 'data:image/jpeg;base64,' + _utils.btoa(newBinary);
  }

  return newBinary;
};

export const insert = (exifBinary: string, imageBinary: string): string => {
  let base64Encoded = false;
  if (exifBinary.slice(0, 6) != '\x45\x78\x69\x66\x00\x00') {
    throw new Error('Given data is not exif.');
  }
  if (imageBinary.slice(0, 2) == '\xff\xd8') {
  } else if (
    imageBinary.slice(0, 23) == 'data:image/jpeg;base64,' ||
    imageBinary.slice(0, 22) == 'data:image/jpg;base64,'
  ) {
    imageBinary = _utils.atob(imageBinary.split(',')[1]);
    base64Encoded = true;
  } else {
    throw new Error('Given data is not jpeg.');
  }

  const app1Segment =
    '\xff\xe1' + _utils.pack('>H', [exifBinary.length + 2]) + exifBinary;
  const segments = _utils.splitIntoSegments(imageBinary);
  let newBinary = _utils.mergeSegments(segments, app1Segment);
  if (base64Encoded) {
    newBinary = 'data:image/jpeg;base64,' + _utils.btoa(newBinary);
  }

  return newBinary;
};

export const load = (binary: string): IExif => {
  let exifBinary;
  if (typeof binary == 'string') {
    if (binary.slice(0, 2) == '\xff\xd8') {
      exifBinary = binary;
    } else if (
      binary.slice(0, 23) == 'data:image/jpeg;base64,' ||
      binary.slice(0, 22) == 'data:image/jpg;base64,'
    ) {
      exifBinary = _utils.atob(binary.split(',')[1]);
    } else if (binary.slice(0, 4) == 'Exif') {
      exifBinary = binary.slice(6);
    } else {
      throw new Error("'load' gots invalid file data.");
    }
  } else {
    throw new Error("'load' gots invalid type argument.");
  }

  const exifObj: IExif = {};
  const exifReader = new _utils.ExifReader(exifBinary);
  if (exifReader.tiftag === null) {
    return exifObj;
  }

  if (exifReader.tiftag.slice(0, 2) == '\x49\x49') {
    exifReader.endianMark = '<';
  } else {
    exifReader.endianMark = '>';
  }

  let zerothIfd: IExifElement = null;
  let firstIfd: IExifElement = null;
  let exifIfd: IExifElement = null;
  let interopIfd: IExifElement = null;
  let gpsIfd: IExifElement = null;
  let thumbnail: string = null;
  const pointer = _utils.unpack(
    exifReader.endianMark + 'L',
    exifReader.tiftag.slice(4, 8),
  )[0];
  zerothIfd = exifReader.getIfd(pointer, '0th');
  const firstIfdPointer = exifReader.getFirstIfdPointer(pointer, '0th');

  if (zerothIfd !== null && 34665 in zerothIfd) {
    const pointer = zerothIfd[34665];
    exifIfd = exifReader.getIfd(pointer, 'Exif');
  }
  if (zerothIfd !== null && 34853 in zerothIfd) {
    const pointer = zerothIfd[34853];
    gpsIfd = exifReader.getIfd(pointer, 'GPS');
  }
  if (exifIfd !== null && 40965 in exifIfd) {
    const pointer = exifIfd[40965];
    interopIfd = exifReader.getIfd(pointer, 'Interop');
  }
  if (firstIfdPointer != '\x00\x00\x00\x00') {
    const pointer = _utils.unpack(
      exifReader.endianMark + 'L',
      firstIfdPointer,
    )[0];
    firstIfd = exifReader.getIfd(pointer, '1st');
    if (firstIfd !== null && 513 in firstIfd && 514 in firstIfd) {
      const end = firstIfd[513] + firstIfd[514];
      thumbnail = exifReader.tiftag.slice(firstIfd[513], end);
    }
  }

  if (zerothIfd !== null) {
    exifObj['0th'] = zerothIfd;
  }
  if (firstIfd !== null) {
    exifObj['1st'] = firstIfd;
  }
  if (exifIfd !== null) {
    exifObj['Exif'] = exifIfd;
  }
  if (gpsIfd !== null) {
    exifObj['GPS'] = gpsIfd;
  }
  if (interopIfd !== null) {
    exifObj['Interop'] = interopIfd;
  }
  if (thumbnail !== null) {
    exifObj['thumbnail'] = thumbnail;
  }
  return exifObj;
};

export const dump = (originalExifObj: IExif): string => {
  const TIFF_HEADER_LENGTH = 8;

  const exifObj: IExif = _utils.copy(originalExifObj);
  const header = 'Exif\x00\x00\x4d\x4d\x00\x2a\x00\x00\x00\x08';
  let existExifIfd = false;
  let existGpsIfd = false;
  let existInteropIfd = false;
  let existFirstIfd = false;

  let zerothIfd: IExifElement,
    exifIfd: IExifElement,
    interopIfd: IExifElement,
    gpsIfd: IExifElement,
    firstIfd: IExifElement;

  if ('0th' in exifObj) {
    zerothIfd = exifObj['0th'];
  } else {
    zerothIfd = {};
  }

  if (
    ('Exif' in exifObj && Object.keys(exifObj['Exif']).length) ||
    ('Interop' in exifObj && Object.keys(exifObj['Interop']).length)
  ) {
    zerothIfd[34665] = 1;
    existExifIfd = true;
    exifIfd = exifObj['Exif'];
    if ('Interop' in exifObj && Object.keys(exifObj['Interop']).length) {
      exifIfd[40965] = 1;
      existInteropIfd = true;
      interopIfd = exifObj['Interop'];
    } else if (
      Object.keys(exifIfd).indexOf(
        TagValues.ExifIFD.InteroperabilityTag.toString(),
      ) > -1
    ) {
      delete exifIfd[40965];
    }
  } else if (
    Object.keys(zerothIfd).indexOf(TagValues.ImageIFD.ExifTag.toString()) > -1
  ) {
    delete zerothIfd[34665];
  }

  if ('GPS' in exifObj && Object.keys(exifObj['GPS']).length) {
    zerothIfd[TagValues.ImageIFD.GPSTag] = 1;
    existGpsIfd = true;
    gpsIfd = exifObj['GPS'];
  } else if (
    Object.keys(zerothIfd).indexOf(TagValues.ImageIFD.GPSTag.toString()) > -1
  ) {
    delete zerothIfd[TagValues.ImageIFD.GPSTag];
  }

  if (
    '1st' in exifObj &&
    'thumbnail' in exifObj &&
    exifObj['thumbnail'] != null
  ) {
    existFirstIfd = true;
    exifObj['1st'][513] = 1;
    exifObj['1st'][514] = 1;
    firstIfd = exifObj['1st'];
  }

  const zerothIfdSet = _utils.dictToBytes(zerothIfd, '0th', 0);
  const zerothIfdLength =
    zerothIfdSet[0].length +
    Number(existExifIfd) * 12 +
    Number(existGpsIfd) * 12 +
    4 +
    zerothIfdSet[1].length;

  let exifIfdSet,
    exifIfdBytes = '',
    exifIfdLength = 0,
    gpsIfdSet,
    gpsIfdBytes = '',
    gpsIfdLength = 0,
    interopIfdSet,
    interopIfdBytes = '',
    interopIfdLength = 0,
    firstIfdSet,
    firstIfdBytes = '',
    thumbnail;
  if (existExifIfd) {
    exifIfdSet = _utils.dictToBytes(exifIfd, 'Exif', zerothIfdLength);
    exifIfdLength =
      exifIfdSet[0].length +
      Number(existInteropIfd) * 12 +
      exifIfdSet[1].length;
  }
  if (existGpsIfd) {
    gpsIfdSet = _utils.dictToBytes(
      gpsIfd,
      'GPS',
      zerothIfdLength + exifIfdLength,
    );
    gpsIfdBytes = gpsIfdSet.join('');
    gpsIfdLength = gpsIfdBytes.length;
  }
  if (existInteropIfd) {
    const offset = zerothIfdLength + exifIfdLength + gpsIfdLength;
    interopIfdSet = _utils.dictToBytes(interopIfd, 'Interop', offset);
    interopIfdBytes = interopIfdSet.join('');
    interopIfdLength = interopIfdBytes.length;
  }
  if (existFirstIfd) {
    const offset =
      zerothIfdLength + exifIfdLength + gpsIfdLength + interopIfdLength;
    firstIfdSet = _utils.dictToBytes(firstIfd, '1st', offset);
    thumbnail = _utils.getThumbnail(exifObj['thumbnail']);
    if (thumbnail.length > 64000) {
      throw new Error('Given thumbnail is too large. max 64kB');
    }
  }

  let exifPointer = '',
    gpsPointer = '',
    interopPointer = '',
    firstIfdPointer = '\x00\x00\x00\x00';
  if (existExifIfd) {
    const pointerValue = TIFF_HEADER_LENGTH + zerothIfdLength;
    const pointerBinary = _utils.pack('>L', [pointerValue]);
    const key = 34665;
    const keyBinary = _utils.pack('>H', [key]);
    const typeBinary = _utils.pack('>H', [Types['Long']]);
    const lengthBinary = _utils.pack('>L', [1]);
    exifPointer = keyBinary + typeBinary + lengthBinary + pointerBinary;
  }
  if (existGpsIfd) {
    const pointerValue = TIFF_HEADER_LENGTH + zerothIfdLength + exifIfdLength;
    const pointerBinary = _utils.pack('>L', [pointerValue]);
    const key = 34853;
    const keyBinary = _utils.pack('>H', [key]);
    const typeBinary = _utils.pack('>H', [Types['Long']]);
    const lengthBinary = _utils.pack('>L', [1]);
    gpsPointer = keyBinary + typeBinary + lengthBinary + pointerBinary;
  }
  if (existInteropIfd) {
    const pointerValue =
      TIFF_HEADER_LENGTH + zerothIfdLength + exifIfdLength + gpsIfdLength;
    const pointerBinary = _utils.pack('>L', [pointerValue]);
    const key = 40965;
    const keyBinary = _utils.pack('>H', [key]);
    const typeBinary = _utils.pack('>H', [Types['Long']]);
    const lengthBinary = _utils.pack('>L', [1]);
    interopPointer = keyBinary + typeBinary + lengthBinary + pointerBinary;
  }
  if (existFirstIfd) {
    const pointerValue =
      TIFF_HEADER_LENGTH +
      zerothIfdLength +
      exifIfdLength +
      gpsIfdLength +
      interopIfdLength;
    firstIfdPointer = _utils.pack('>L', [pointerValue]);
    const thumbnailPointer =
      pointerValue + firstIfdSet[0].length + 24 + 4 + firstIfdSet[1].length;
    const thumbnailPointerBinary =
      '\x02\x01\x00\x04\x00\x00\x00\x01' +
      _utils.pack('>L', [thumbnailPointer]);
    const thumbnailLengthBinary =
      '\x02\x02\x00\x04\x00\x00\x00\x01' +
      _utils.pack('>L', [thumbnail.length]);
    firstIfdBytes =
      firstIfdSet[0] +
      thumbnailPointerBinary +
      thumbnailLengthBinary +
      '\x00\x00\x00\x00' +
      firstIfdSet[1] +
      thumbnail;
  }

  const zerothIfdBinary =
    zerothIfdSet[0] +
    exifPointer +
    gpsPointer +
    firstIfdPointer +
    zerothIfdSet[1];
  if (existExifIfd) {
    exifIfdBytes = exifIfdSet[0] + interopPointer + exifIfdSet[1];
  }

  return (
    header +
    zerothIfdBinary +
    exifIfdBytes +
    gpsIfdBytes +
    interopIfdBytes +
    firstIfdBytes
  );
};
