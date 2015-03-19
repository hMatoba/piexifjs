Piexifjs
========

.. image:: https://travis-ci.org/hMatoba/piexifjs.svg?branch=master
    :target: https://travis-ci.org/hMatoba/piexifjs

Ported library from Python. Read and modify exif.

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

    var exifStr = piexif.dump({"0th":{282:[100, 1], 283:[100, 1]}});
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

License
-------

This software is released under the MIT License, see LICENSE.txt.
