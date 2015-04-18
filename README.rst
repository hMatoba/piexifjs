Piexifjs
========

.. image:: https://travis-ci.org/hMatoba/piexifjs.svg?branch=master
    :target: https://travis-ci.org/hMatoba/piexifjs

Read and modify exif. Library to modify exif in JS(both client-side and Node.js).

How to Use
----------

- *var exifObj = load(jpegData)* - Get exif data as *object*. *jpegData* must be a *string* that starts with "data:image/jpeg;base64,"(DataURL), "\\xff\\xd8", or "Exif".
- *var exifStr = dump(exifObj)* - Get exif as *string* to insert into JPEG.
- *insert(exifStr, jpegData)* - Insert exif into JPEG. If *jpegData* is DataURL, returns JPEG as DataURL. Else if *jpegData* is binary as *string*, returns JPEG as binary as *string*.
- *remove(jpegData)* - Remove exif from JPEG. If *jpegData* is DataURL, returns JPEG as DataURL. Else if *jpegData* is binary as *string*, returns JPEG as binary as *string*.

Use with File API or Canvas API.

Example
-------

::

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

    //var exifObj = {"0th":{282:[100, 1], 283:[100, 1]}};
    var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
    var exifStr = piexif.dump(exifObj);
    var reader = new FileReader();
    reader.onloadend = function(e) {
        var inserted = piexif.insert(exifStr, e.target.result);

        var image = new Image();
        image.src = inserted;
        image.width = 200;
        var el = $("<div></div>").append(image);
        $("#resized").prepend(el);

    };
    reader.readAsDataURL(f);

::

    var reader = new FileReader();
    reader.onloadend = function(e) {
        var exifObj = piexif.load(e.target.result);
        for (var ifd in exifObj) {
            if (ifd == "thumbnail") {
                continue;
            }
            console.log("-" + ifd);
            for (var tag in exifObj[ifd]) {
                console.log("  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
            }
        }
    };
    reader.readAsDataURL(f);

Node.js
-------

::

    var piexif = require("piexif.js");
    var fs = require("fs");

    var filename1 = "in.jpg";
    var filename2 = "out.jpg";

    var jpeg = fs.readFileSync(filename1);
    var data = jpeg.toString("binary");
    var exifObj = piexif.load(data);
    exifObj["GPS"][piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
    exifObj["GPS"][piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    var exifbytes = piexif.dump(exifObj);
    var newData = piexif.insert(exifbytes, data);
    var newJpeg = new Buffer(newData, "binary");
    fs.writeFileSync(filename2, newJpeg);

Dependency
----------

Doesn't need other libraries.

Environment
-----------

Tested on IE11, Opera28, and PhantomJS 1.9.8. It runs on even Node.js.

License
-------

This software is released under the MIT License, see LICENSE.txt.
