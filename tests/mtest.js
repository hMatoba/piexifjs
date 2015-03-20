// roundtrip(load, dump, insert)
Tests.RoundtripTest = function () {
    console.log("Roundtrip Test: Get exif data as object from jpeg data. " +
                "Convert exif object into binary. " +
                "Get exif data as object again from the binary. " +
                "Compare values between two exif objects.");

    var passed = 0;
    var files = Tests.files;
    var noexif = Tests.files["noexif.jpg"];
    
    for (var file in files) {
        console.log("\n+" + file);
        var jpeg = files[file];
        var exifObj1 = piexif.load(jpeg);
        var exifStr = piexif.dump(exifObj1);
        var newJpeg = piexif.insert(exifStr, noexif);
        var exifObj2 = piexif.load(newJpeg);

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
                phestum.assertEqual(exifObj1[ifd][tag], exifObj2[ifd][tag]);
                console.log("  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj1[ifd][tag]);
            }
        }
        passed += 1;
    }
    
    console.log("\n\npassed " + passed + " file(s).");
};


// test2: 'remove'
Tests.removeTest = function () {
    console.log("'remove' Test:");

    var files = Tests.files;
    var passedFile = 0;
    var failedFile = 0;

    for (var file in files) {
        if (file === "noexif.jpg") {
            continue;
        }
        console.log("+" + file);

        var jpeg = files[file];
        var removed = piexif.remove(jpeg);
        var exifObj = piexif.load(removed);

        var keyNum = 0
        if (exifObj["thumbnail"] != null) {
            failedFile += 1;
            continue;
        } else {
            delete exifObj.thumbnail;
        }
        for (var ifd in exifObj) {
            for (var tag in exifObj[ifd]) {
                tag = parseInt(tag);
                keyNum += 1;
            }
        }

        if (keyNum) {
            failedFile += 1;
        } else {
            passedFile += 1;
        }
    }

    console.log("\n");
    console.log("Passed file: " + passedFile + " file(s)");
    console.log("Failed file: " + failedFile + " file(s)");
    if (failedFile) {
        throw("");
    }
};
