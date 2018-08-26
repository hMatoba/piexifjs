import * as constants from './constants';

const nStr = (ch:string, num:number) => {
    var str = "";
    for (var i = 0; i < num; i++) {
        str += ch;
    }
    return str;
};

export const pack = (mark:string, array:Array<number>) => {
    if (!(array instanceof Array)) {
        throw ("'pack' error. Got invalid type argument.");
    }
    if ((mark.length - 1) != array.length) {
        throw ("'pack' error. " + (mark.length - 1) + " marks, " + array.length + " elements.");
    }

    var littleEndian;
    if (mark[0] == "<") {
        littleEndian = true;
    } else if (mark[0] == ">") {
        littleEndian = false;
    } else {
        throw ("");
    }
    var packed = "";
    var p = 1;
    var val = null;
    var c = null;
    var valStr = null;

    while (c = mark[p]) {
        if (c.toLowerCase() == "b") {
            val = array[p - 1];
            if ((c == "b") && (val < 0)) {
                val += 0x100;
            }
            if ((val > 0xff) || (val < 0)) {
                throw ("'pack' error.");
            } else {
                valStr = String.fromCharCode(val);
            }
        } else if (c == "H") {
            val = array[p - 1];
            if ((val > 0xffff) || (val < 0)) {
                throw ("'pack' error.");
            } else {
                valStr = String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                    String.fromCharCode(val % 0x100);
                if (littleEndian) {
                    valStr = valStr.split("").reverse().join("");
                }
            }
        } else if (c.toLowerCase() == "l") {
            val = array[p - 1];
            if ((c == "l") && (val < 0)) {
                val += 0x100000000;
            }
            if ((val > 0xffffffff) || (val < 0)) {
                throw ("'pack' error.");
            } else {
                valStr = String.fromCharCode(Math.floor(val / 0x1000000)) +
                    String.fromCharCode(Math.floor((val % 0x1000000) / 0x10000)) +
                    String.fromCharCode(Math.floor((val % 0x10000) / 0x100)) +
                    String.fromCharCode(val % 0x100);
                if (littleEndian) {
                    valStr = valStr.split("").reverse().join("");
                }
            }
        } else {
            throw ("'pack' error.");
        }

        packed += valStr;
        p += 1;
    }

    return packed;
};

export const unpack = (mark:string, str:string) => {
    if (typeof (str) != "string") {
        throw ("'unpack' error. Got invalid type argument.");
    }
    var l = 0;
    for (var markPointer = 1; markPointer < mark.length; markPointer++) {
        if (mark[markPointer].toLowerCase() == "b") {
            l += 1;
        } else if (mark[markPointer].toLowerCase() == "h") {
            l += 2;
        } else if (mark[markPointer].toLowerCase() == "l") {
            l += 4;
        } else {
            throw ("'unpack' error. Got invalid mark.");
        }
    }

    if (l != str.length) {
        throw ("'unpack' error. Mismatch between symbol and string length. " + l + ":" + str.length);
    }

    var littleEndian;
    if (mark[0] == "<") {
        littleEndian = true;
    } else if (mark[0] == ">") {
        littleEndian = false;
    } else {
        throw ("'unpack' error.");
    }
    var unpacked = [];
    var strPointer = 0;
    var p = 1;
    var val = null;
    var c = null;
    var length = null;
    var sliced = "";

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
            throw ("'unpack' error. " + c);
        }

        unpacked.push(val);
        strPointer += length;
        p += 1;
    }

    return unpacked;
};

const isBrowser = (new Function("try {return this===window;}catch(e){ return false;}"))();
export const atob:Function = isBrowser 
                              ? window.atob
                              : (input:string) => {
                                    const decoded = Buffer.from(input,'base64');
                                    return decoded;
                                };
export const btoa:Function = isBrowser
                            ? window.btoa
                            : (input:string) => {
                                const buf = Buffer.from(input);
                                const encoded = buf.toString('base64');
                                return encoded;
                              };


const _pack_byte = (array:Array<number>) => {
    return pack(">" + nStr("B", array.length), array);
};


const _pack_short = (array:Array<number>) => {
    return pack(">" + nStr("H", array.length), array);
};


const _pack_long = (array:Array<number>) => {
    return pack(">" + nStr("L", array.length), array);
};


export const copy = (obj:any) => {
    const copied = {}
    Object.assign(copied, obj)
    return obj;
};


export const _get_thumbnail = (jpeg:string) => {
    var segments = splitIntoSegments(jpeg);
    while (("\xff\xe0" <= segments[1].slice(0, 2)) && (segments[1].slice(0, 2) <= "\xff\xef")) {
        segments = [segments[0]].concat(segments.slice(2));
    }
    return segments.join("");
};

const _value_to_bytes = (raw_value:any, value_type:string, offset:number) => {
    var four_bytes_over = "";
    var value_str = "";
    var length,
        new_value,
        num,
        den;

    if (value_type == "Byte") {
        length = raw_value.length;
        if (length <= 4) {
            value_str = (_pack_byte(raw_value) +
                nStr("\x00", 4 - length));
        } else {
            value_str = pack(">L", [offset]);
            four_bytes_over = _pack_byte(raw_value);
        }
    } else if (value_type == "Short") {
        length = raw_value.length;
        if (length <= 2) {
            value_str = (_pack_short(raw_value) +
                nStr("\x00\x00", 2 - length));
        } else {
            value_str = pack(">L", [offset]);
            four_bytes_over = _pack_short(raw_value);
        }
    } else if (value_type == "Long") {
        length = raw_value.length;
        if (length <= 1) {
            value_str = _pack_long(raw_value);
        } else {
            value_str = pack(">L", [offset]);
            four_bytes_over = _pack_long(raw_value);
        }
    } else if (value_type == "Ascii") {
        new_value = raw_value + "\x00";
        length = new_value.length;
        if (length > 4) {
            value_str = pack(">L", [offset]);
            four_bytes_over = new_value;
        } else {
            value_str = new_value + nStr("\x00", 4 - length);
        }
    } else if (value_type == "Rational") {
        if (typeof (raw_value[0]) == "number") {
            length = 1;
            num = raw_value[0];
            den = raw_value[1];
            new_value = pack(">L", [num]) + pack(">L", [den]);
        } else {
            length = raw_value.length;
            new_value = "";
            for (var n = 0; n < length; n++) {
                num = raw_value[n][0];
                den = raw_value[n][1];
                new_value += (pack(">L", [num]) +
                    pack(">L", [den]));
            }
        }
        value_str = pack(">L", [offset]);
        four_bytes_over = new_value;
    } else if (value_type == "SRational") {
        if (typeof (raw_value[0]) == "number") {
            length = 1;
            num = raw_value[0];
            den = raw_value[1];
            new_value = pack(">l", [num]) + pack(">l", [den]);
        } else {
            length = raw_value.length;
            new_value = "";
            for (var n = 0; n < length; n++) {
                num = raw_value[n][0];
                den = raw_value[n][1];
                new_value += (pack(">l", [num]) +
                    pack(">l", [den]));
            }
        }
        value_str = pack(">L", [offset]);
        four_bytes_over = new_value;
    } else if (value_type == "Undefined") {
        length = raw_value.length;
        if (length > 4) {
            value_str = pack(">L", [offset]);
            four_bytes_over = raw_value;
        } else {
            value_str = raw_value + nStr("\x00", 4 - length);
        }
    }

    var length_str = pack(">L", [length]);

    return [length_str, value_str, four_bytes_over];
};

export const _dict_to_bytes = (ifd_dict:any, ifd:string, ifd_offset:number) => {
    var TIFF_HEADER_LENGTH = 8;
    var tag_count = Object.keys(ifd_dict).length;
    var entry_header = pack(">H", [tag_count]);
    var entries_length;
    if (["0th", "1st"].indexOf(ifd) > -1) {
        entries_length = 2 + tag_count * 12 + 4;
    } else {
        entries_length = 2 + tag_count * 12;
    }
    var entries = "";
    var values = "";
    var key;

    for (key in ifd_dict) {
        if (typeof (key) == "string") {
            key = parseInt(key);
        }
        if ((ifd == "0th") && ([34665, 34853].indexOf(key) > -1)) {
            continue;
        } else if ((ifd == "Exif") && (key == 40965)) {
            continue;
        } else if ((ifd == "1st") && ([513, 514].indexOf(key) > -1)) {
            continue;
        }

        var raw_value = ifd_dict[key];
        var key_str = pack(">H", [key]);
        var value_type:string = constants.Tags[ifd][key]["type"];
        var type_str = pack(">H", [constants.Types[value_type]]);

        if (typeof (raw_value) == "number") {
            raw_value = [raw_value];
        }
        var offset = TIFF_HEADER_LENGTH + entries_length + ifd_offset + values.length;
        var b = _value_to_bytes(raw_value, value_type, offset);
        var length_str = b[0];
        var value_str = b[1];
        var four_bytes_over = b[2];

        entries += key_str + type_str + length_str + value_str;
        values += four_bytes_over;
    }

    return [entry_header + entries, values];
}



export class ExifReader {
    tiftag: string;
    endian_mark: string;
    constructor (data:string) {
        var segments,
            app1;
        if (data.slice(0, 2) == "\xff\xd8") { // JPEG
            segments = splitIntoSegments(data);
            app1 = getExifSeg(segments);
            if (app1) {
                this.tiftag = app1.slice(10);
            } else {
                this.tiftag = null;
            }
        } else if (["\x49\x49", "\x4d\x4d"].indexOf(data.slice(0, 2)) > -1) { // TIFF
            this.tiftag = data;
        } else if (data.slice(0, 4) == "Exif") { // Exif
            this.tiftag = data.slice(6);
        } else {
            throw ("Given file is neither JPEG nor TIFF.");
        }
    }

    get_ifd = (pointer:number, ifd_name:string) => {
        var tag_count = unpack(this.endian_mark + "H",
                             this.tiftag.slice(pointer, pointer + 2))[0];
        if (tag_count == 0) {
            return null;
        }
        var ifd_dict:any = {};
        var offset = pointer + 2;
        var t;
        if (["0th", "1st"].indexOf(ifd_name) > -1) {
            t = "Image";
        } else {
            t = ifd_name;
        }

        for (var x = 0; x < tag_count; x++) {
            pointer = offset + 12 * x;
            var tag = unpack(this.endian_mark + "H",
                this.tiftag.slice(pointer, pointer + 2))[0];
            var value_type = unpack(this.endian_mark + "H",
                this.tiftag.slice(pointer + 2, pointer + 4))[0];
            var value_num = unpack(this.endian_mark + "L",
                this.tiftag.slice(pointer + 4, pointer + 8))[0];
            var value = this.tiftag.slice(pointer + 8, pointer + 12);

            var v_set = [value_type, value_num, value];
            if (tag in constants.Tags[t]) {
                ifd_dict[tag] = this.convert_value(v_set);
            }
        }

        if (ifd_name == "0th") {
            pointer = offset + 12 * tag_count;
            ifd_dict["first_ifd_pointer"] = this.tiftag.slice(pointer, pointer + 4);
        }

        return ifd_dict;
    }

    convert_value = (val:any) => {
        var data = null;
        var t = val[0];
        var length = val[1];
        var value = val[2];
        var pointer;

        if (t == 1) { // BYTE
            if (length > 4) {
                pointer = unpack(this.endian_mark + "L", value)[0];
                data = unpack(this.endian_mark + nStr("B", length),
                    this.tiftag.slice(pointer, pointer + length));
            } else {
                data = unpack(this.endian_mark + nStr("B", length), value.slice(0, length));
            }
        } else if (t == 2) { // ASCII
            if (length > 4) {
                pointer = unpack(this.endian_mark + "L", value)[0];
                data = this.tiftag.slice(pointer, pointer + length - 1);
            } else {
                data = value.slice(0, length - 1);
            }
        } else if (t == 3) { // SHORT
            if (length > 2) {
                pointer = unpack(this.endian_mark + "L", value)[0];
                data = unpack(this.endian_mark + nStr("H", length),
                    this.tiftag.slice(pointer, pointer + length * 2));
            } else {
                data = unpack(this.endian_mark + nStr("H", length),
                    value.slice(0, length * 2));
            }
        } else if (t == 4) { // LONG
            if (length > 1) {
                pointer = unpack(this.endian_mark + "L", value)[0];
                data = unpack(this.endian_mark + nStr("L", length),
                    this.tiftag.slice(pointer, pointer + length * 4));
            } else {
                data = unpack(this.endian_mark + nStr("L", length),
                    value);
            }
        } else if (t == 5) { // RATIONAL
            pointer = unpack(this.endian_mark + "L", value)[0];
            if (length > 1) {
                data = [];
                for (var x = 0; x < length; x++) {
                    data.push([unpack(this.endian_mark + "L",
                            this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                               unpack(this.endian_mark + "L",
                            this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                               ]);
                }
            } else {
                data = [unpack(this.endian_mark + "L",
                        this.tiftag.slice(pointer, pointer + 4))[0],
                        unpack(this.endian_mark + "L",
                        this.tiftag.slice(pointer + 4, pointer + 8))[0]
                        ];
            }
        } else if (t == 7) { // UNDEFINED BYTES
            if (length > 4) {
                pointer = unpack(this.endian_mark + "L", value)[0];
                data = this.tiftag.slice(pointer, pointer + length);
            } else {
                data = value.slice(0, length);
            }
        } else if (t == 10) { // SRATIONAL
            pointer = unpack(this.endian_mark + "L", value)[0];
            if (length > 1) {
                data = [];
                for (var x = 0; x < length; x++) {
                    data.push([unpack(this.endian_mark + "l",
                            this.tiftag.slice(pointer + x * 8, pointer + 4 + x * 8))[0],
                               unpack(this.endian_mark + "l",
                            this.tiftag.slice(pointer + 4 + x * 8, pointer + 8 + x * 8))[0]
                              ]);
                }
            } else {
                data = [unpack(this.endian_mark + "l",
                        this.tiftag.slice(pointer, pointer + 4))[0],
                        unpack(this.endian_mark + "l",
                        this.tiftag.slice(pointer + 4, pointer + 8))[0]
                       ];
            }
        } else {
            throw ("Exif might be wrong. Got incorrect value " +
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
        throw ("Given data isn't JPEG.");
    }

    var head = 2;
    var segments = ["\xff\xd8"];
    while (true) {
        if (data.slice(head, head + 2) == "\xff\xda") {
            segments.push(data.slice(head));
            break;
        } else {
            var length = unpack(">H", data.slice(head + 2, head + 4))[0];
            var endPoint = head + length + 2;
            segments.push(data.slice(head, endPoint));
            head = endPoint;
        }

        if (head >= data.length) {
            throw ("Wrong JPEG data.");
        }
    }
    return segments;
};


const getExifSeg = (segments:Array<string>) => {
    var seg;
    for (var i = 0; i < segments.length; i++) {
        seg = segments[i];
        if (seg.slice(0, 2) == "\xff\xe1" &&
               seg.slice(4, 10) == "Exif\x00\x00") {
            return seg;
        }
    }
    return null;
};


export const mergeSegments = (segments:Array<string>, exif:string) => {
    var hasExifSegment = false;
    var additionalAPP1ExifSegments:Array<number> = [];

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