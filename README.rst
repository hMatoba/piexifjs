Piexifjs
========

Ported library from Python. Read and modify exif.

How to Use
----------

- *load(jpegData)* - Get exif data as *object*.
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
    
License
-------

This software is released under the MIT License, see LICENSE.txt.
