Piexifjs
========

.. image:: https://travis-ci.org/hMatoba/piexifjs.svg?branch=master
    :target: https://travis-ci.org/hMatoba/piexifjs

Ported library from Python. Read and modify exif.

How to Use
----------

- *load(jpegData)* - Get exif data as *object*. *jpegData* must be a *string* that starts with "data:image/jpeg;base64,", "\\xff\\xd8", or "Exif".
- *dump(exifObj)* - Get exif as *string* to insert into JPEG.
- *insert(exifStr, jpegData)* - Insert exif into JPEG.

Use with File API or Canvas API.

Example
-------

::

    var exifStr = piexif.dump({"0th":{282:[100, 1], 283:[100, 1]}});
    var reader = new FileReader();
    reader.onloadend = (function(theFile) {
        return function(e) {
            var inserted = piexif.insert(exifStr, e.target.result);

            var image = new Image();
            image.src = inserted;
            image.width = 200;
            var el = $("<div></div>").append(image);
            $("#resized").prepend(el);
        };
    })(f);
    reader.readAsDataURL(f);

::

    var reader = new FileReader();
    reader.onloadend = (function(theFile) {
        return function(e) {
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
    })(f);
    reader.readAsDataURL(f);

License
-------

This software is released under the MIT License, see LICENSE.txt.
