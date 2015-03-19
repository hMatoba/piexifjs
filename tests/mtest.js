// phantomjs.exe mtest.js

var fs = require("fs");
eval(fs.read("piexif.js"));


var passed = 0;
var failed = 0;


function checkEqual(a, b) {
    if (a instanceof Array) {
        if (a.length !== b.length) {
            return false;
        }
        for (var p=0; p<a.length; p++) {
            if (!checkEqual(a[p], b[p])){
                return false;
            }
        }
        return true;      
    } else {
        if (a === b) {
            return true;
        } else {
            return false;
        }
    }
}

var files = ["images/r_canon.jpg",
             "images/r_casio.jpg",
             "images/r_olympus.jpg",
             "images/r_pana.jpg",
             "images/r_ricoh.jpg",
             "images/r_sigma.jpg",
             "images/r_sony.jpg"];

console.log("Roundtrip Test: Get exif data as object from jpeg data. Convert exif object into binary. Get exif data as object again from the binary. Compare values between two exif objects.");

for (var p=0; p<files.length; p++) {
    var mismatched = 0;
    console.log("\n==================\n+" + files[p]);
    var jpeg = fs.read(files[p], {charset: "LATIN-1"});
    var exifObj1 = piexif.load(jpeg);
    var exifStr = piexif.dump(exifObj1);
    var exifObj2 = piexif.load(exifStr);
    
    for (var ifd in exifObj1) {
        if (ifd == "thumbnail") {
            continue;
        }
        console.log("-" + ifd);
        
        for (var tag in exifObj1[ifd]) {
            tag = parseInt(tag);
            if ((ifd == "0th") && ([34665, 34853].indexOf(tag) > -1)) {
                continue;
            } else if ((ifd == "Exif") && (tag == 40965)) {
                continue;
            } else if ((ifd == "1st") && ([513, 514].indexOf(tag) > -1)) {
                continue;
            }
            var equal = checkEqual(exifObj1[ifd][tag], exifObj2[ifd][tag]);
            if (equal) {
                console.log("  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj1[ifd][tag]);
            } else {
                console.log("* " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj1[ifd][tag] +
                            "---" + exifObj2[ifd][tag] + "mismatch");
                mismatched += 1;
            }
        }
    }
    
    if (mismatched) {
        failed += 1;
    } else {
        passed += 1;
    }
}

console.log("\n\n\n*******************************");
console.log("Passed: " + passed + " file(s)");
console.log("Failed: " + failed + " file(s)");
if (failed) {
    phantom.exit(1);
} else {
    phantom.exit();
}
