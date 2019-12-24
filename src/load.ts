import * as _utils from "./utils";
import { IExif, IExifElement } from "./interfaces";
import { TagValues } from "./constants";
import { ExifReader } from "./exif_reader";

export const load = (bytes: string): IExif => {
  const exifBytes = getExifBytes(bytes);

  const exifObj: IExif = {};
  const exifReader = new ExifReader(exifBytes);
  if (exifReader.tiftag === null) {
    return exifObj;
  }
  exifReader.setEndianMark();

  let zerothIfd: IExifElement = null;
  let firstIfd: IExifElement = null;
  let exifIfd: IExifElement = null;
  let interopIfd: IExifElement = null;
  let gpsIfd: IExifElement = null;
  let thumbnail: string = null;
  const IFD_POINTER_BEGIN = 4;
  const IFD_POINTER_LENGTH = 4;

  const zerothIfdPointer = _utils.unpack(
    exifReader.endianMark + "L",
    exifReader.tiftag.slice(IFD_POINTER_BEGIN, IFD_POINTER_BEGIN + IFD_POINTER_LENGTH)
  )[0];
  zerothIfd = exifReader.getIfd(zerothIfdPointer, "0th");
  exifObj["0th"] = zerothIfd;

  if (zerothIfd !== null && TagValues.ImageIFD.ExifTag in zerothIfd) {
    const exifIfdPointer = zerothIfd[TagValues.ImageIFD.ExifTag];
    exifIfd = exifReader.getIfd(exifIfdPointer as number, "Exif");
    exifObj["Exif"] = exifIfd;
  }

  if (zerothIfd !== null && TagValues.ImageIFD.GPSTag in zerothIfd) {
    const gpsIfdPointer = zerothIfd[TagValues.ImageIFD.GPSTag];
    gpsIfd = exifReader.getIfd(gpsIfdPointer as number, "GPS");
    exifObj["GPS"] = gpsIfd;
  }

  if (exifIfd !== null && TagValues.ExifIFD.InteroperabilityTag in exifIfd) {
    const interopIfdPointer = exifIfd[TagValues.ExifIFD.InteroperabilityTag];
    interopIfd = exifReader.getIfd(interopIfdPointer as number, "Interop");
    exifObj["Interop"] = interopIfd;
  }

  const firstIfdPointerBytes = exifReader.getFirstIfdPointer(zerothIfdPointer, "0th");
  if (firstIfdPointerBytes != "\x00\x00\x00\x00") {
    const firstIfdPointer = _utils.unpack(exifReader.endianMark + "L", firstIfdPointerBytes)[0];
    firstIfd = exifReader.getIfd(firstIfdPointer, "1st");
    exifObj["1st"] = firstIfd;
    if (firstIfd !== null && TagValues.ImageIFD.JPEGInterchangeFormat in firstIfd && TagValues.ImageIFD.JPEGInterchangeFormatLength in firstIfd) {
      const thumbnailEnd = (firstIfd[TagValues.ImageIFD.JPEGInterchangeFormat] as number) + (firstIfd[TagValues.ImageIFD.JPEGInterchangeFormatLength] as number);
      thumbnail = exifReader.tiftag.slice(firstIfd[TagValues.ImageIFD.JPEGInterchangeFormat] as number, thumbnailEnd);
      exifObj["thumbnail"] = thumbnail;
    }
  }

  return exifObj;
};

const getExifBytes = (bytes: string): string => {
  let exifBytes;
  if (typeof bytes == "string") {
    if (bytes.slice(0, 2) == "\xff\xd8") {
      exifBytes = bytes;
    } else if (
      bytes.slice(0, 23) == "data:image/jpeg;base64," ||
      bytes.slice(0, 22) == "data:image/jpg;base64,"
    ) {
      exifBytes = _utils.atob(bytes.split(",")[1]);
    } else if (bytes.slice(0, 4) == "Exif") {
      exifBytes = bytes.slice(6);
    } else {
      throw new Error("'load' gots invalid file data.");
    }
  } else {
    throw new Error("'load' gots invalid type argument.");
  }

  return exifBytes;
};