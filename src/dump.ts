import * as _utils from "./utils";
import { Types, IExif, IExifElement } from "./interfaces";
import { TagValues } from "./constants";


export const dump = (originalExifObj: IExif): string => {
  const TIFF_HEADER_LENGTH = 8;

  const exifObj: IExif = _utils.copy(originalExifObj);
  const header = "Exif\x00\x00\x4d\x4d\x00\x2a\x00\x00\x00\x08";
  let existExifIfd = false;
  let existGpsIfd = false;
  let existInteropIfd = false;
  let existFirstIfd = false;

  let zerothIfd: IExifElement,
    exifIfd: IExifElement,
    interopIfd: IExifElement,
    gpsIfd: IExifElement,
    firstIfd: IExifElement;

  if ("0th" in exifObj) {
    zerothIfd = exifObj["0th"];
  } else {
    zerothIfd = {};
  }

  if (
    ("Exif" in exifObj && Object.keys(exifObj["Exif"]).length) ||
    ("Interop" in exifObj && Object.keys(exifObj["Interop"]).length)
  ) {
    zerothIfd[TagValues.ImageIFD.ExifTag] = 1;
    existExifIfd = true;
    exifIfd = exifObj["Exif"];
    if ("Interop" in exifObj && Object.keys(exifObj["Interop"]).length) {
      exifIfd[TagValues.ExifIFD.InteroperabilityTag] = 1;
      existInteropIfd = true;
      interopIfd = exifObj["Interop"];
    } else if (
      Object.keys(exifIfd).indexOf(
        TagValues.ExifIFD.InteroperabilityTag.toString()
      ) > -1
    ) {
      delete exifIfd[TagValues.ExifIFD.InteroperabilityTag];
    }
  } else if (
    Object.keys(zerothIfd).indexOf(TagValues.ImageIFD.ExifTag.toString()) > -1
  ) {
    delete zerothIfd[TagValues.ImageIFD.ExifTag];
  }

  if ("GPS" in exifObj && Object.keys(exifObj["GPS"]).length) {
    zerothIfd[TagValues.ImageIFD.GPSTag] = 1;
    existGpsIfd = true;
    gpsIfd = exifObj["GPS"];
  } else if (
    Object.keys(zerothIfd).indexOf(TagValues.ImageIFD.GPSTag.toString()) > -1
  ) {
    delete zerothIfd[TagValues.ImageIFD.GPSTag];
  }

  if (
    "1st" in exifObj &&
    "thumbnail" in exifObj &&
    exifObj["thumbnail"] != null
  ) {
    existFirstIfd = true;
    exifObj["1st"][TagValues.ImageIFD.JPEGInterchangeFormat] = 1;
    exifObj["1st"][TagValues.ImageIFD.JPEGInterchangeFormatLength] = 1;
    firstIfd = exifObj["1st"];
  }

  const zerothIfdSet = _utils.dictToBytes(zerothIfd, "0th", 0);
  const zerothIfdLength =
    zerothIfdSet[0].length +
    Number(existExifIfd) * 12 +
    Number(existGpsIfd) * 12 +
    4 +
    zerothIfdSet[1].length;

  let exifIfdSet,
    exifIfdBytes = "",
    exifIfdLength = 0,
    gpsIfdSet,
    gpsIfdBytes = "",
    gpsIfdLength = 0,
    interopIfdSet,
    interopIfdBytes = "",
    interopIfdLength = 0,
    firstIfdSet,
    firstIfdBytes = "",
    thumbnail;
  if (existExifIfd) {
    exifIfdSet = _utils.dictToBytes(exifIfd, "Exif", zerothIfdLength);
    exifIfdLength =
      exifIfdSet[0].length +
      Number(existInteropIfd) * 12 +
      exifIfdSet[1].length;
  }
  if (existGpsIfd) {
    gpsIfdSet = _utils.dictToBytes(
      gpsIfd,
      "GPS",
      zerothIfdLength + exifIfdLength
    );
    gpsIfdBytes = gpsIfdSet.join("");
    gpsIfdLength = gpsIfdBytes.length;
  }
  if (existInteropIfd) {
    const offset = zerothIfdLength + exifIfdLength + gpsIfdLength;
    interopIfdSet = _utils.dictToBytes(interopIfd, "Interop", offset);
    interopIfdBytes = interopIfdSet.join("");
    interopIfdLength = interopIfdBytes.length;
  }
  if (existFirstIfd) {
    const offset =
      zerothIfdLength + exifIfdLength + gpsIfdLength + interopIfdLength;
    firstIfdSet = _utils.dictToBytes(firstIfd, "1st", offset);
    thumbnail = _utils.getThumbnail(exifObj["thumbnail"]);
    if (thumbnail.length > 64000) {
      throw new Error("Given thumbnail is too large. max 64kB");
    }
  }

  let exifPointer = "",
    gpsPointer = "",
    interopPointer = "",
    firstIfdPointer = "\x00\x00\x00\x00";
  if (existExifIfd) {
    const pointerValue = TIFF_HEADER_LENGTH + zerothIfdLength;
    const pointerBytes = _utils.pack(">L", [pointerValue]);
    const key = TagValues.ImageIFD.ExifTag;
    const keyBytes = _utils.pack(">H", [key]);
    const typeBytes = _utils.pack(">H", [Types["Long"]]);
    const lengthBytes = _utils.pack(">L", [1]);
    exifPointer = keyBytes + typeBytes + lengthBytes + pointerBytes;
  }
  if (existGpsIfd) {
    const pointerValue = TIFF_HEADER_LENGTH + zerothIfdLength + exifIfdLength;
    const pointerBytes = _utils.pack(">L", [pointerValue]);
    const key = TagValues.ImageIFD.GPSTag;
    const keyBytes = _utils.pack(">H", [key]);
    const typeBytes = _utils.pack(">H", [Types["Long"]]);
    const lengthBytes = _utils.pack(">L", [1]);
    gpsPointer = keyBytes + typeBytes + lengthBytes + pointerBytes;
  }
  if (existInteropIfd) {
    const pointerValue =
      TIFF_HEADER_LENGTH + zerothIfdLength + exifIfdLength + gpsIfdLength;
    const pointerBytes = _utils.pack(">L", [pointerValue]);
    const key = TagValues.ExifIFD.InteroperabilityTag;
    const keyBytes = _utils.pack(">H", [key]);
    const typeBytes = _utils.pack(">H", [Types["Long"]]);
    const lengthBytes = _utils.pack(">L", [1]);
    interopPointer = keyBytes + typeBytes + lengthBytes + pointerBytes;
  }
  if (existFirstIfd) {
    const pointerValue =
      TIFF_HEADER_LENGTH +
      zerothIfdLength +
      exifIfdLength +
      gpsIfdLength +
      interopIfdLength;
    firstIfdPointer = _utils.pack(">L", [pointerValue]);
    const thumbnailPointer =
      pointerValue + firstIfdSet[0].length + 24 + 4 + firstIfdSet[1].length;
    const thumbnailPointerBytes =
      "\x02\x01\x00\x04\x00\x00\x00\x01" +
      _utils.pack(">L", [thumbnailPointer]);
    const thumbnailLengthBytes =
      "\x02\x02\x00\x04\x00\x00\x00\x01" +
      _utils.pack(">L", [thumbnail.length]);
    firstIfdBytes =
      firstIfdSet[0] +
      thumbnailPointerBytes +
      thumbnailLengthBytes +
      "\x00\x00\x00\x00" +
      firstIfdSet[1] +
      thumbnail;
  }

  const zerothIfdBytes =
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
    zerothIfdBytes +
    exifIfdBytes +
    gpsIfdBytes +
    interopIfdBytes +
    firstIfdBytes
  );
};
