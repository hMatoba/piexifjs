import { Types, TagsFieldNames, IExifElement } from "./interfaces";
import * as exceptions from "./exceptions";
import { Tags } from "./constants";

export interface ValueSet {
  type: number;
  length: number;
  value: string;
}

export const nLoopStr = (ch: string, num: number): string => {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += ch;
  }
  return str;
};

export const pack = (mark: string, array: Array<number>): string => {
  if (!(array instanceof Array)) {
    throw new Error("'pack' error. Got invalid type argument.");
  }
  if (mark.length - 1 != array.length) {
    throw new Error(
      `'pack' error. ${mark.length - 1} marks, ${array.length} elements.`
    );
  }

  let littleEndian;
  if (mark[0] == "<") {
    littleEndian = true;
  } else if (mark[0] == ">") {
    littleEndian = false;
  } else {
    throw new Error("Not match any endian.");
  }
  let packed = "";
  let p = 1;
  let val = null;
  let c = null;
  let valBinary = null;

  while ((c = mark[p])) {
    if (c.toLowerCase() == "b") {
      val = array[p - 1];
      if (c == "b" && val < 0) {
        val += 0x100;
      }
      if (val > 0xff || val < 0) {
        throw new Error("'pack' error.");
      } else {
        valBinary = String.fromCharCode(val);
      }
    } else if (c == "H") {
      val = array[p - 1];
      if (val > 0xffff || val < 0) {
        throw new Error("'pack' error.");
      } else {
        valBinary =
          String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
          String.fromCharCode(val % 0x100);
        if (littleEndian) {
          valBinary = valBinary
            .split("")
            .reverse()
            .join("");
        }
      }
    } else if (c.toLowerCase() == "l") {
      val = array[p - 1];
      if (c == "l" && val < 0) {
        val += 0x100000000;
      }
      if (val > 0xffffffff || val < 0) {
        throw new Error("'pack' error.");
      } else {
        valBinary =
          String.fromCharCode(Math.floor(val / 0x1000000)) +
          String.fromCharCode(Math.floor((val % 0x1000000) / 0x10000)) +
          String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
          String.fromCharCode(val % 0x100);
        if (littleEndian) {
          valBinary = valBinary
            .split("")
            .reverse()
            .join("");
        }
      }
    } else {
      throw new Error("'pack' error.");
    }

    packed += valBinary;
    p += 1;
  }

  return packed;
};

export const unpack = (mark: string, str: string): number[] => {
  if (typeof str != "string") {
    throw new Error("'unpack' error. Got invalid type argument.");
  }
  let l = 0;
  for (let markPointer = 1; markPointer < mark.length; markPointer++) {
    if (mark[markPointer].toLowerCase() == "b") {
      l += 1;
    } else if (mark[markPointer].toLowerCase() == "h") {
      l += 2;
    } else if (mark[markPointer].toLowerCase() == "l") {
      l += 4;
    } else {
      throw new Error("'unpack' error. Got invalid mark.");
    }
  }

  if (l != str.length) {
    throw new Error(
      "'unpack' error. Mismatch between symbol and string length. " +
        l +
        ":" +
        str.length
    );
  }

  let littleEndian;
  if (mark[0] == "<") {
    littleEndian = true;
  } else if (mark[0] == ">") {
    littleEndian = false;
  } else {
    throw new Error("'unpack' error.");
  }
  const unpacked = [];
  let strPointer = 0;
  let p = 1;
  let val = null;
  let c = null;
  let length = null;
  let sliced = "";

  while ((c = mark[p])) {
    if (c.toLowerCase() == "b") {
      length = 1;
      sliced = str.slice(strPointer, strPointer + length);
      val = sliced.charCodeAt(0);
      if (c == "b" && val >= 0x80) {
        val -= 0x100;
      }
    } else if (c == "H") {
      length = 2;
      sliced = str.slice(strPointer, strPointer + length);
      if (littleEndian) {
        sliced = sliced
          .split("")
          .reverse()
          .join("");
      }
      val = sliced.charCodeAt(0) * 0x100 + sliced.charCodeAt(1);
    } else if (c.toLowerCase() == "l") {
      length = 4;
      sliced = str.slice(strPointer, strPointer + length);
      if (littleEndian) {
        sliced = sliced
          .split("")
          .reverse()
          .join("");
      }
      val =
        sliced.charCodeAt(0) * 0x1000000 +
        sliced.charCodeAt(1) * 0x10000 +
        sliced.charCodeAt(2) * 0x100 +
        sliced.charCodeAt(3);
      if (c == "l" && val >= 0x80000000) {
        val -= 0x100000000;
      }
    } else {
      throw new Error("'unpack' error. " + c);
    }

    unpacked.push(val);
    strPointer += length;
    p += 1;
  }

  return unpacked;
};

export const _isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)();
export const atob: Function = _isBrowser
  ? window.atob
  : (input: string): Buffer => {
      const decoded = Buffer.from(input, "base64");
      return decoded;
    };
export const btoa: Function = _isBrowser
  ? window.btoa
  : (input: string): string => {
      const buf = Buffer.from(input);
      const encoded = buf.toString("base64");
      return encoded;
    };

export const _packByte = (array: Array<number>): string => {
  return pack(">" + nLoopStr("B", array.length), array);
};

export const _packShort = (array: Array<number>): string => {
  return pack(">" + nLoopStr("H", array.length), array);
};

export const _packLong = (array: Array<number>): string => {
  return pack(">" + nLoopStr("L", array.length), array);
};

export const copy = <T extends object>(obj: T): T => {
  const copied = {};
  Object.assign(copied, obj);
  return obj;
};

export const getThumbnail = (jpeg: string): string => {
  let segments = splitIntoSegments(jpeg);
  while (
    "\xff\xe0" <= segments[1].slice(0, 2) &&
    segments[1].slice(0, 2) <= "\xff\xef"
  ) {
    segments = [segments[0]].concat(segments.slice(2));
  }
  return segments.join("");
};

export const _valueToBytes = (
  rawValue: string | number | number[] | number[][],
  valueType: number,
  offset: number
): ITagBinary => {
  let tagBinary;
  if (valueType == Types.Byte) {
    tagBinary = _toByte(rawValue as number | number[], offset);
  } else if (valueType == Types.Ascii) {
    tagBinary = _toAscii(rawValue as string, offset);
  } else if (valueType == Types.Short) {
    tagBinary = _toShort(rawValue as number | number[], offset);
  } else if (valueType == Types.Long) {
    tagBinary = _toLong(rawValue as number | number[], offset);
  } else if (valueType == Types.Rational) {
    tagBinary = _toRational(rawValue as number[] | number[][], offset);
  } else if (valueType == Types.Undefined) {
    tagBinary = _toUndefined(rawValue as string, offset);
  } else if (valueType == Types.SLong) {
    throw new Error("Not implemented for SLong value");
  } else if (valueType == Types.SRational) {
    tagBinary = _toSRational(rawValue as number[] | number[][], offset);
  } else {
    throw new Error("Got unhandled exif value type.");
  }

  return tagBinary;
};

interface ITagBinary {
  value: string;
  // length:number,
  lengthBinary: string;
  fourBytesOver: string;
}

export const _toByte = (
  rawValue: number | number[],
  offset: number
): ITagBinary => {
  if (typeof rawValue == "number") {
    rawValue = [rawValue];
  } else if (Array.isArray(rawValue) && typeof rawValue[0] === "number") {
    // pass
  } else {
    const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    throw new exceptions.ValueConvertError(
      `Value must be "number" or "Array<number>".\n` +
        `Value: ${rawValue}\n` +
        `Type: ${t}`
    );
  }

  const length = rawValue.length;
  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  if (length <= 4) {
    tagBinary.value = _packByte(rawValue) + nLoopStr("\x00", 4 - length);
  } else {
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = _packByte(rawValue);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  return tagBinary;
};

export const _toAscii = (rawValue: string, offset: number): ITagBinary => {
  if (typeof rawValue !== "string") {
    const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    throw new exceptions.ValueConvertError(
      `Value must be "string". Got "${t}".`
    );
  }

  const newValue = rawValue + "\x00";
  const length = newValue.length;
  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  if (length > 4) {
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = newValue;
  } else {
    tagBinary.value = newValue + nLoopStr("\x00", 4 - length);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  return tagBinary;
};

export const _toShort = (
  rawValue: number | number[],
  offset: number
): ITagBinary => {
  if (typeof rawValue == "number") {
    rawValue = [rawValue];
  } else if (Array.isArray(rawValue) && typeof rawValue[0] === "number") {
    // pass
  } else {
    const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    throw new exceptions.ValueConvertError(
      `Value must be "number" or "Array<number>".\n` +
        `Value: ${rawValue}\n` +
        `Type: ${t}`
    );
  }

  const length = rawValue.length;
  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  if (length <= 2) {
    tagBinary.value = _packShort(rawValue) + nLoopStr("\x00\x00", 2 - length);
  } else {
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = _packShort(rawValue);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  return tagBinary;
};

export const _toLong = (
  rawValue: number | number[],
  offset: number
): ITagBinary => {
  if (typeof rawValue == "number") {
    rawValue = [rawValue];
  } else if (Array.isArray(rawValue) && typeof rawValue[0] === "number") {
    // pass
  } else {
    const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    throw new exceptions.ValueConvertError(
      `Value must be "number" or "Array<number>".\n` +
        `Value: ${rawValue}\n` +
        `Type: ${t}`
    );
  }

  const length = rawValue.length;
  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  if (length <= 1) {
    tagBinary.value = _packLong(rawValue);
  } else {
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = _packLong(rawValue);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  return tagBinary;
};

export const _toRational = (
  rawValue: number[] | number[][],
  offset: number
): ITagBinary => {
  let value: number[][];
  if (
    Array.isArray(rawValue) &&
    typeof rawValue[0] === "number" &&
    rawValue.length === 2
  ) {
    value = [rawValue as number[]];
  } else if (
    Array.isArray(rawValue) &&
    Array.isArray(rawValue[0]) &&
    typeof (rawValue as number[][])[0][0] === "number"
  ) {
    value = rawValue as number[][];
  } else {
    let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    t = t == "Array" ? `Array<${typeof rawValue[0]}>` : t;
    throw new exceptions.ValueConvertError(
      `Value must be "Array<number>" or "Array<Array<number>>". Got "${t}".`
    );
  }

  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  const length = value.length;
  let newValue = "";
  for (let n = 0; n < length; n++) {
    const num = value[n][0];
    const den = value[n][1];
    newValue += pack(">L", [num]) + pack(">L", [den]);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  tagBinary.value = pack(">L", [offset]);
  tagBinary.fourBytesOver = newValue;
  return tagBinary;
};

export const _toUndefined = (rawValue: string, offset: number): ITagBinary => {
  if (typeof rawValue !== "string") {
    const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    throw new exceptions.ValueConvertError(
      `Value must be "string". Got "${t}".`
    );
  }

  const length = rawValue.length;
  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  if (length > 4) {
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = rawValue;
  } else {
    tagBinary.value = rawValue + nLoopStr("\x00", 4 - length);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  return tagBinary;
};

export const _toSRational = (
  rawValue: number[] | number[][],
  offset: number
): ITagBinary => {
  let value: number[][];
  if (
    Array.isArray(rawValue) &&
    typeof rawValue[0] === "number" &&
    rawValue.length === 2
  ) {
    value = [rawValue as number[]];
  } else if (
    Array.isArray(rawValue) &&
    Array.isArray(rawValue[0]) &&
    typeof (rawValue as number[][])[0][0] === "number"
  ) {
    // pass
  } else {
    let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
    t = t == "Array" ? `Array<${typeof rawValue[0]}>` : t;
    throw new exceptions.ValueConvertError(
      `Value must be "Array<number>" or "Array<Array<number>>". Got "${t}".`
    );
  }

  const tagBinary: ITagBinary = {
    value: "",
    lengthBinary: "",
    fourBytesOver: ""
  };
  const length = value.length;
  let newValue = "";
  for (let n = 0; n < length; n++) {
    const num = value[n][0];
    const den = value[n][1];
    newValue += pack(">l", [num]) + pack(">l", [den]);
  }
  tagBinary.lengthBinary = pack(">L", [length]);
  tagBinary.value = pack(">L", [offset]);
  tagBinary.fourBytesOver = newValue;
  return tagBinary;
};

export const dictToBytes = (
  ifdObj: IExifElement,
  ifdName: TagsFieldNames,
  ifdOffsetCount: number
): string[] => {
  const TIFF_HEADER_LENGTH = 8;
  const tagCount = Object.keys(ifdObj).length;
  const entryHeader = pack(">H", [tagCount]);
  let entriesLength;
  if (["0th", "1st"].indexOf(ifdName) > -1) {
    entriesLength = 2 + tagCount * 12 + 4;
  } else {
    entriesLength = 2 + tagCount * 12;
  }
  let entries = "";
  let values = "";
  let key;

  for (key in ifdObj) {
    if (typeof key == "string") {
      key = parseInt(key);
    }
    if (ifdName == "0th" && [34665, 34853].indexOf(key) > -1) {
      continue;
    } else if (ifdName == "Exif" && key == 40965) {
      continue;
    } else if (ifdName == "1st" && [513, 514].indexOf(key) > -1) {
      continue;
    }

    const rawValue = ifdObj[key];
    const keyBinary = pack(">H", [key]);
    const valueType: number = Tags[ifdName][key]["type"];
    const typeBinary = pack(">H", [valueType]);

    const offset =
      TIFF_HEADER_LENGTH + entriesLength + ifdOffsetCount + values.length;
    let b: ITagBinary;
    try {
      b = _valueToBytes(rawValue, valueType, offset);
    } catch (e) {
      if (e instanceof exceptions.ValueConvertError) {
        const _ifdName = ["0th", "1st"].includes(ifdName) ? "Image" : ifdName;
        const tagName = Tags[_ifdName][key]["name"];
        const errorMessage = `Can't convert ${tagName} in ${ifdName} IFD.\r`;
        e.message = errorMessage + e.message;
      }
      throw e;
    }

    entries += keyBinary + typeBinary + b.lengthBinary + b.value;
    values += b.fourBytesOver;
  }
  return [entryHeader + entries, values];
};

export const splitIntoSegments = (data: string): string[] => {
  if (data.slice(0, 2) != "\xff\xd8") {
    throw new Error("Given data isn't JPEG.");
  }

  let head = 2;
  const segments = ["\xff\xd8"];
  while (true) {
    if (data.slice(head, head + 2) == "\xff\xda") {
      segments.push(data.slice(head));
      break;
    } else {
      const length = unpack(">H", data.slice(head + 2, head + 4))[0];
      const endPoint = head + length + 2;
      segments.push(data.slice(head, endPoint));
      head = endPoint;
    }

    if (head >= data.length) {
      throw new Error("Wrong JPEG data.");
    }
  }
  return segments;
};

export const getExifSeg = (segments: Array<string>): string => {
  let seg;
  for (let i = 0; i < segments.length; i++) {
    seg = segments[i];
    if (seg.slice(0, 2) == "\xff\xe1" && seg.slice(4, 10) == "Exif\x00\x00") {
      return seg;
    }
  }
  return null;
};

export const mergeSegments = (
  segments: Array<string>,
  exif: string
): string => {
  let hasExifSegment = false;
  const additionalAPP1ExifSegments: Array<number> = [];

  segments.forEach(function(segment, i) {
    // Replace first occurence of APP1:Exif segment
    if (
      segment.slice(0, 2) == "\xff\xe1" &&
      segment.slice(4, 10) == "Exif\x00\x00"
    ) {
      if (!hasExifSegment) {
        segments[i] = exif;
        hasExifSegment = true;
      } else {
        additionalAPP1ExifSegments.unshift(i);
      }
    }
  });

  // Remove additional occurences of APP1:Exif segment
  additionalAPP1ExifSegments.forEach(function(segmentIndex) {
    segments.splice(segmentIndex, 1);
  });

  if (!hasExifSegment && exif) {
    segments = [segments[0], exif].concat(segments.slice(1));
  }

  return segments.join("");
};
