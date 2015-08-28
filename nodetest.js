var phestum = {
    _isEqual : function (a, b) {
        if (typeof(a) !== typeof(b)) {
            return false;
        } else if (a === undefined && b === undefined){
            return true;
        } else if (a instanceof Array && b instanceof Array) {
            if (a.length !== b.length) {
                return false;
            }
            for (var p=0; p<a.length; p++) {
                if (!phestum._isEqual(a[p], b[p])){
                    return false;
                }
            }
            return true;
        } else if (typeof(a) === "object" && typeof(b) === "object") {
            if (a === null && b === null) {
                return true;
            }
            var propA = Object.getOwnPropertyNames(a);
            var propB = Object.getOwnPropertyNames(b);
            propA.sort();
            propB.sort();

            // check property names equality
            if (propA.length !== propB.length) {
                return false;
            } else {
                for (var p=0; p<propA.length; p++) {
                    if (!phestum._isEqual(propA[p], propB[p])){
                        return false;
                    }
                }
            }

            // check object value equality
            for (var p=0; p<propA.length; p++) {
                var prop = propA[p];
                if (!phestum._isEqual(a[prop], b[prop])){
                    return false;
                }
            }
            return true;
        } else if (typeof(a) === "string" || typeof(a) === "number") {
            if (a === b) {
                return true;
            } else {
                return false;
            }
        } else {
            throw("Got variable that cannot compare.");
        }
    },

    assertEqual : function (a, b) {
        if (!phestum._isEqual(a, b)) {
            throw("! " + JSON.stringify(a) + " != " + JSON.stringify(b));
        }
    },

    assertNotEqual : function (a, b) {
        if (phestum._isEqual(a, b)) {
            throw("! " + JSON.stringify(a) + " == " + JSON.stringify(b));
        }
    },
    
    assertFail : function (func) {
        var failed = false;
        try {
            func();
        } catch (e) {
            failed = true;
        }
        
        if (!failed) {
            throw("'phestum.assertFail' error. Given function didn't failed.");
        }
    },
};

var fs = require("fs");
var piexif = require("./piexif.js");

var jpeg = fs.readFileSync("tests/files/noexif.jpg");
var data = jpeg.toString("binary");

var zeroth = {};
var exif = {};
var gps = {};
zeroth[piexif.ImageIFD.Make] = "Make";
zeroth[piexif.ImageIFD.XResolution] = [777, 1];
zeroth[piexif.ImageIFD.YResolution] = [777, 1];
zeroth[piexif.ImageIFD.Software] = "Piexifjs";
exif[piexif.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10";
exif[piexif.ExifIFD.LensMake] = "LensMake";
exif[piexif.ExifIFD.Sharpness] = 777;
exif[piexif.ExifIFD.LensSpecification] = [[1, 1], [1, 1], [1, 1], [1, 1]];
gps[piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
gps[piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
var exifbytes = piexif.dump(exifObj);

var newData = piexif.insert(exifbytes, data);
//var newJpeg = new Buffer(newData, "binary");
//fs.writeFileSync("out.jpg", newJpeg);

var exifObj2 = piexif.load(newData);

try {
    delete exifObj2["0th"][34665];
    delete exifObj2["0th"][34853];
    delete exifObj2["Interop"];
    delete exifObj2["1st"];
    delete exifObj2["thumbnail"];
    phestum.assertEqual(exifObj, exifObj2);
    console.log("Successed Nodejs test.");
    process.exit();
} catch (e){
    console.log(e);
    console.log("Failed Nodejs test.");
    process.exit(1);
}