
const toHex = (str:string) => {
    var hexStr = "";
    for (var i = 0; i < str.length; i++) {
        var h = str.charCodeAt(i);
        var hex = ((h < 10) ? "0" : "") + h.toString(16);
        hexStr += hex + " ";
    }
    return hexStr;
};

const nStr = (ch:string, num:number) => {
    var str = "";
    for (var i = 0; i < num; i++) {
        str += ch;
    }
    return str;
};

const pack = (mark:string, array:Array<number>) => {
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

const unpack = (mark:string, str:string) => {
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

let isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
let atob2:any;
 btoa;
if (isBrowser) {
    atob2 = window.atob;
}
if (typeof atob === "undefined") {
    var atob = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        return output;
    };
}