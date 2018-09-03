import * as constants from './constants';
import * as interfaces from './interfaces';
import * as exceptions from './exceptions';
import { isArray } from 'util';

export const _nLoopStr = (ch:string, num:number) => {
    let str = "";
    for (let i = 0; i < num; i++) {
        str += ch;
    }
    return str;
};

export const pack = (mark:string, array:Array<number>) => {
    // if (!(array instanceof Array)) {
    //     throw new Error("'pack' error. Got invalid type argument.");
    // }
    if ((mark.length - 1) != array.length) {
        throw new Error("'pack' error. " + (mark.length - 1) + " marks, " + array.length + " elements.");
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

    while (c = mark[p]) {
        if (c.toLowerCase() == "b") {
            val = array[p - 1];
            if ((c == "b") && (val < 0)) {
                val += 0x100;
            }
            if ((val > 0xff) || (val < 0)) {
                throw new Error("'pack' error.");
            } else {
                valBinary = String.fromCharCode(val);
            }
        } else if (c == "H") {
            val = array[p - 1];
            if ((val > 0xffff) || (val < 0)) {
                throw new Error("'pack' error.");
            } else {
                valBinary = String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                    String.fromCharCode(val % 0x100);
                if (littleEndian) {
                    valBinary = valBinary.split("").reverse().join("");
                }
            }
        } else if (c.toLowerCase() == "l") {
            val = array[p - 1];
            if ((c == "l") && (val < 0)) {
                val += 0x100000000;
            }
            if ((val > 0xffffffff) || (val < 0)) {
                throw new Error("'pack' error.");
            } else {
                valBinary = String.fromCharCode(Math.floor(val / 0x1000000)) +
                    String.fromCharCode(Math.floor((val % 0x1000000) / 0x10000)) +
                    String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                    String.fromCharCode(val % 0x100);
                if (littleEndian) {
                    valBinary = valBinary.split("").reverse().join("");
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

export const unpack = (mark:string, str:string) => {
    if (typeof (str) != "string") {
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
        throw new Error("'unpack' error. Mismatch between symbol and string length. " + l + ":" + str.length);
    }

    let littleEndian;
    if (mark[0] == "<") {
        littleEndian = true;
    } else if (mark[0] == ">") {
        littleEndian = false;
    } else {
        throw new Error("'unpack' error.");
    }
    let unpacked = [];
    let strPointer = 0;
    let p = 1;
    let val = null;
    let c = null;
    let length = null;
    let sliced = "";

    while (c = mark[p]) {
        if (c.toLowerCase() == "b") {
            length = 1;
            sliced = str.slice(strPointer, strPointer + length);
            val = sliced.charCodeAt(0);
            if ((c == "b") && (val >= 0x80)) {
                val -= 0x100;
            }
        } else if (c == "H") {
            length = 2;
            sliced = str.slice(strPointer, strPointer + length);
            if (littleEndian) {
                sliced = sliced.split("").reverse().join("");
            }
            val = sliced.charCodeAt(0) * 0x100 +
                sliced.charCodeAt(1);
        } else if (c.toLowerCase() == "l") {
            length = 4;
            sliced = str.slice(strPointer, strPointer + length);
            if (littleEndian) {
                sliced = sliced.split("").reverse().join("");
            }
            val = sliced.charCodeAt(0) * 0x1000000 +
                sliced.charCodeAt(1) * 0x10000 +
                sliced.charCodeAt(2) * 0x100 +
                sliced.charCodeAt(3);
            if ((c == "l") && (val >= 0x80000000)) {
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

export const _isBrowser = (new Function("try {return this===window;}catch(e){ return false;}"))();
export const atob:Function = _isBrowser 
                             ? window.atob
                             : (input:string) => {
                                const decoded = Buffer.from(input,'base64');
                                return decoded;
                              };
export const btoa:Function = _isBrowser
                             ? window.btoa
                             : (input:string) => {
                                const buf = Buffer.from(input);
                                const encoded = buf.toString('base64');
                                return encoded;
                              };


export const _packByte = (array:Array<number>) => {
    return pack(">" + _nLoopStr("B", array.length), array);
};


export const _packShort = (array:Array<number>) => {
    return pack(">" + _nLoopStr("H", array.length), array);
};


export const _packLong = (array:Array<number>) => {
    return pack(">" + _nLoopStr("L", array.length), array);
};


export const copy = (obj:any) => {
    const copied = {}
    Object.assign(copied, obj)
    return obj;
};


export const getThumbnail = (jpeg:string) => {
    let segments = splitIntoSegments(jpeg);
    while (("\xff\xe0" <= segments[1].slice(0, 2)) && (segments[1].slice(0, 2) <= "\xff\xef")) {
        segments = [segments[0]].concat(segments.slice(2));
    }
    return segments.join("");
};

export const _valueToBytes = (rawValue:any, valueType:number, offset:number) => {
    let tagBinary;
    if (valueType == constants.Types.Byte) {
        tagBinary = _toByte(rawValue, offset);
    } else if (valueType == constants.Types.Ascii) {
        tagBinary = _toAscii(rawValue, offset)
    } else if (valueType == constants.Types.Short) {
        tagBinary = _toShort(rawValue, offset);
    } else if (valueType == constants.Types.Long) {
        tagBinary = _toLong(rawValue, offset);
    } else if (valueType == constants.Types.Rational) {
        tagBinary = _toRational(rawValue, offset);
    } else if (valueType == constants.Types.Undefined) {
        tagBinary = _toUndefined(rawValue, offset);
    } else if (valueType == constants.Types.SLong) {
        throw new Error('Not implemented for SLong value');
    } else if (valueType == constants.Types.SRational) {
        tagBinary = _toSRational(rawValue, offset);
    } else {
        throw new Error("Got unhandled exif value type.");
    }

    const lengthBinary = pack(">L", [tagBinary.length]);

    return [lengthBinary, tagBinary.value, tagBinary.fourBytesOver];
};

interface ITagBinary {
    value:string,
    length:number,
    fourBytesOver:string
};


export const _toByte = (rawValue:any, offset:number) => {
    if (!Array.isArray(rawValue) || (typeof rawValue[0] !== 'number')) {
        let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        t = (t == 'Array') ? `Array<${typeof rawValue[0]}>` : t;
        throw new exceptions.ValueConvertError(`Value must be "number" or "Array<number>". Got ${t}`);
    }

    const length = rawValue.length;
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if (length <= 4) {
        tagBinary.value = (_packByte(rawValue) +
            _nLoopStr("\x00", 4 - length));
    } else {
        tagBinary.value = pack(">L", [offset]);
        tagBinary.fourBytesOver = _packByte(rawValue);
    }
    tagBinary.length = length;
    return tagBinary;
};

export const _toAscii = (rawValue:string, offset:number) => {
    if (typeof rawValue !== 'string') {
        const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        throw new exceptions.ValueConvertError(`alue must be "string". Got ${t}`);
    }

    const newValue = rawValue + "\x00";
    const length = newValue.length;
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if (length > 4) {
        tagBinary.value = pack(">L", [offset]);
        tagBinary.fourBytesOver = newValue;
    } else {
        tagBinary.value = newValue + _nLoopStr("\x00", 4 - length);
    }
    tagBinary.length = length;
    return tagBinary;
};

export const _toShort = (rawValue:any, offset:number) => {
    if (!Array.isArray(rawValue) || (typeof rawValue[0] !== 'number')) {
        let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        t = (t == 'Array') ? `Array<${typeof rawValue[0]}>` : t;
        throw new exceptions.ValueConvertError(`Value must be "number" or "Array<number>". Got ${t}`);
    }

    const length = rawValue.length;
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if (length <= 2) {
        tagBinary.value = (_packShort(rawValue) +
            _nLoopStr("\x00\x00", 2 - length));
    } else {
        tagBinary.value = pack(">L", [offset]);
        tagBinary.fourBytesOver = _packShort(rawValue);
    }
    tagBinary.length = length;
    return tagBinary;
};

export const _toLong = (rawValue:any, offset:number) => {
    if (!Array.isArray(rawValue) || (typeof rawValue[0] !== 'number')) {
        let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        t = (t == 'Array') ? `Array<${typeof rawValue[0]}>` : t;
        throw new exceptions.ValueConvertError(`Value must be "number" or "Array<number>". Got ${t}`);
    }

    const length = rawValue.length;
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if (length <= 1) {
        tagBinary.value = _packLong(rawValue);
    } else {
        tagBinary.value = pack(">L", [offset]);
        tagBinary.fourBytesOver = _packLong(rawValue);
    }
    tagBinary.length = length;
    return tagBinary;
};

export const _toRational = (rawValue:any, offset:number) => {
    if (!Array.isArray(rawValue)) {
        let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        t = (t == 'Array') ? `Array<${typeof rawValue[0]}>` : t;
        throw new exceptions.ValueConvertError(`Value must be "number" or "Array<number>". Got ${t}`);
    }

    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    let newValue;
    let length;
    if ((typeof rawValue[0]) == "number") {
        length = 1;
        const num = rawValue[0];
        const den = rawValue[1];
        newValue = pack(">L", [num]) + pack(">L", [den]);
    } else {
        length = rawValue.length;
        newValue = "";
        for (let n = 0; n < length; n++) {
            const num = rawValue[n][0];
            const den = rawValue[n][1];
            newValue += (pack(">L", [num]) +
                         pack(">L", [den]));
        }
    
    }
    tagBinary.length = length;
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = newValue;   
    return tagBinary;
};

export const _toUndefined = (rawValue:string, offset:number) => {
    if (typeof rawValue !== 'string') {
        const t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        throw new exceptions.ValueConvertError(`Value must be "string". Got ${t}`);
    }

    const length = rawValue.length;
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if (length > 4) {
        tagBinary.value = pack(">L", [offset]);
        tagBinary.fourBytesOver = rawValue;
    } else {
        tagBinary.value = rawValue + _nLoopStr("\x00", 4 - length);
    }
    tagBinary.length = length;
    return tagBinary;
};


export const _toSRational = (rawValue:any, offset:number) => {
    if (!Array.isArray(rawValue)) {
        let t = Array.isArray(rawValue) ? "Array" : typeof rawValue;
        t = (t == 'Array') ? `Array<${typeof rawValue[0]}>` : t;
        throw new exceptions.ValueConvertError(`Value must be "number" or "Array<number>". Got ${t}`);
    }

    let length;
    let newValue = "";
    let tagBinary:ITagBinary = {
        value: '',
        length: null,
        fourBytesOver: ''
    };
    if ((typeof rawValue[0]) == "number") {
        length = 1;
        const num = rawValue[0];
        const den = rawValue[1];
        newValue = pack(">l", [num]) + pack(">l", [den]);
    } else {
        length = rawValue.length;
        newValue = "";
        for (let n = 0; n < length; n++) {
            const num = rawValue[n][0];
            const den = rawValue[n][1];
            newValue += (pack(">l", [num]) +
                pack(">l", [den]));
        }
    }
    tagBinary.length = length;
    tagBinary.value = pack(">L", [offset]);
    tagBinary.fourBytesOver = newValue;
    return tagBinary;
};


export const dictToBytes = (ifdObj:any, ifdName:string, ifdOffsetCount:number) => {
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
        if (typeof (key) == "string") {
            key = parseInt(key);
        }
        if ((ifdName == "0th") && ([34665, 34853].indexOf(key) > -1)) {
            continue;
        } else if ((ifdName == "Exif") && (key == 40965)) {
            continue;
        } else if ((ifdName == "1st") && ([513, 514].indexOf(key) > -1)) {
            continue;
        }

        let rawValue = ifdObj[key];
        const keyBinary = pack(">H", [key]);
        const valueType:number = constants.Tags[ifdName][key]["type"];
        const typeBinary = pack(">H", [valueType]);

        if (typeof (rawValue) == "number") {
            rawValue = [rawValue];
        }
        const offset = TIFF_HEADER_LENGTH + entriesLength + ifdOffsetCount + values.length;
        let b;
        try {
            b = _valueToBytes(rawValue, valueType, offset);
        } catch (e) {
            if (e instanceof exceptions.ValueConvertError) {
                console.error(e.message);
                const _ifdName = ['0th', '1st'].includes(ifdName) ? 'Image' : ifdName;
                const tagName = constants.Tags[_ifdName][key]['name'];
                throw new Error(`Can't convert ${tagName} in ${ifdName} IFD.`);
            }
            throw e;
        }
        const lengthBinary = b[0];
        const valueBinary = b[1];
        const fourBytesOver = b[2];

        entries += keyBinary + typeBinary + lengthBinary + valueBinary;
        values += fourBytesOver;
    }
    return [entryHeader + entries, values];
}

export class ExifReader {
    tiftag: string;
    endianMark: string;
    constructor (exifBinary:string) {
        let segments,
            app1;
        if (exifBinary.slice(0, 2) == "\xff\xd8") { // JPEG
            segments = splitIntoSegments(exifBinary);
            app1 = getExifSeg(segments);
            if (app1) {
                this.tiftag = app1.slice(10);
            } else {
                this.tiftag = null;
            }
        } else if (["\x49\x49", "\x4d\x4d"].indexOf(exifBinary.slice(0, 2)) > -1) { // TIFF
            this.tiftag = exifBinary;
        } else if (exifBinary.slice(0, 4) == "Exif") { // Exif
            this.tiftag = exifBinary.slice(6);
        } else {
            throw new Error("Given file is neither JPEG nor TIFF.");
        }
    }

    getIfd = (pointer:number, ifdName:string) => {
        const tagCount = unpack(this.endianMark + "H",
                               this.tiftag.slice(pointer, pointer + 2))[0];
        if (tagCount == 0) {
            return null;
        }
        let ifdObj:any = {};
        const offset = pointer + 2;
        let t;
        if (["0th", "1st"].indexOf(ifdName) > -1) {
            t = "Image";
        } else {
            t = ifdName;
        }

        for (let x = 0; x < tagCount; x++) {
            pointer = offset + 12 * x;
            const tag = unpack(this.endianMark + "H",
                               this.tiftag.slice(pointer, pointer + 2))[0];
            const valueType = unpack(this.endianMark + "H",
                                      this.tiftag.slice(pointer + 2, pointer + 4))[0];
            const valueNum = unpack(this.endianMark + "L",
                                     this.tiftag.slice(pointer + 4, pointer + 8))[0];
            const value = this.tiftag.slice(pointer + 8, pointer + 12);

            const valueSet = [valueType, valueNum, value];
            if (tag in constants.Tags[t]) {
                ifdObj[tag] = this.convertValue(valueSet);
            }
        }

        if (ifdName == "0th") {
            pointer = offset + 12 * tagCount;
            ifdObj["first_ifd_pointer"] = this.tiftag.slice(pointer, pointer + 4);
        }

        return ifdObj;
    }

    convertValue = (val:any) => {
        let data = null;
        const t = val[0];
        const length = val[1];
        const value = val[2];
        let pointer;

        if (t == 1) { // BYTE
            if (length > 4) {
                pointer = unpack(this.endianMark + "L", value)[0];
                data = unpack(this.endianMark + _nLoopStr("B", length),
                    this.tiftag.slice(pointer, pointer + length));
            } else {
                data = unpack(this.endianMark + _nLoopStr("B", length), value.slice(0, length));
            }
        } else if (t == 2) { // ASCII
            if (length > 4) {
                pointer = unpack(this.endianMark + "L", value)[0];
                data = this.tiftag.slice(pointer, pointer + length - 1);
            } else {
                data = value.slice(0, length - 1);
            }
        } else if (t == 3) { // SHORT
            if (length > 2) {
                pointer = unpack(this.endianMark + "L", value)[0];
                data = unpack(this.endianMark + _nLoopStr("H", length),
                    this.tiftag.slice(pointer, pointer + length * 2));
            } else {
                data = unpack(this.endianMark + _nLoopStr("H", length),
                    value.slice(0, length * 2));
            }
        } else if (t == 4) { // LONG
            if (length > 1) {
                pointer = unpack(this.endianMark + "L", value)[0];
                data = unpack(this.endianMark + _nLoopStr("L", length),
                    this.tiftag.slice(pointer, pointer + length * 4));
            } else {
                data = unpack(this.endianMark + _nLoopStr("L", length),
                    value);
            }
        } else if (t == 5) { // RATIONAL
            pointer = unpack(this.endianMark + "L", value)[0];
            if (length > 1) {
                data = [];
                for (let x = 0; x < length; x++) {
                    data.push([unpack(this.endianMark + "L",
                            this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                               unpack(this.endianMark + "L",
                            this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                               ]);
                }
            } else {
                data = [
                    unpack(this.endianMark + "L",
                    this.tiftag.slice(pointer, pointer + 4))[0],
                    unpack(this.endianMark + "L",
                    this.tiftag.slice(pointer + 4, pointer + 8))[0]
                ];
            }
        } else if (t == 7) { // UNDEFINED BYTES
            if (length > 4) {
                pointer = unpack(this.endianMark + "L", value)[0];
                data = this.tiftag.slice(pointer, pointer + length);
            } else {
                data = value.slice(0, length);
            }
        } else if (t == 10) { // SRATIONAL
            pointer = unpack(this.endianMark + "L", value)[0];
            if (length > 1) {
                data = [];
                for (let x = 0; x < length; x++) {
                    data.push([unpack(this.endianMark + "l",
                            this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                               unpack(this.endianMark + "l",
                            this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                              ]);
                }
            } else {
                data = [unpack(this.endianMark + "l",
                        this.tiftag.slice(pointer, pointer + 4))[0],
                        unpack(this.endianMark + "l",
                        this.tiftag.slice(pointer + 4, pointer + 8))[0]
                       ];
            }
        } else {
            throw new Error("Exif might be wrong. Got incorrect value " +
                "type to decode. type:" + t);
        }

        if ((data instanceof Array) && (data.length == 1)) {
            return data[0];
        } else {
            return data;
        }
    }
}

export const splitIntoSegments = (data:string) => {
    if (data.slice(0, 2) != "\xff\xd8") {
        throw new Error("Given data isn't JPEG.");
    }

    let head = 2;
    let segments = ["\xff\xd8"];
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


const getExifSeg = (segments:Array<string>) => {
    let seg;
    for (let i = 0; i < segments.length; i++) {
        seg = segments[i];
        if (seg.slice(0, 2) == "\xff\xe1" &&
               seg.slice(4, 10) == "Exif\x00\x00") {
            return seg;
        }
    }
    return null;
};


export const mergeSegments = (segments:Array<string>, exif:string) => {
    let hasExifSegment = false;
    let additionalAPP1ExifSegments:Array<number> = [];

    segments.forEach(function(segment, i) {
        // Replace first occurence of APP1:Exif segment
        if (segment.slice(0, 2) == "\xff\xe1" &&
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