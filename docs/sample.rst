=======
Samples
=======

Insert Exif into jpeg
---------------------

::

    <input type="file" id="files" />
    <script source="/js/piexif.js" />
    <script>
    function handleFileSelect(evt) {
        var file = evt.target.files[0];
        
        var zeroth = {};
        var exif = {};
        var gps = {};
        zeroth[piexif.TagValues.ImageIFD.Make] = "Make";
        zeroth[piexif.TagValues.ImageIFD.XResolution] = [777, 1];
        zeroth[piexif.TagValues.ImageIFD.YResolution] = [777, 1];
        zeroth[piexif.TagValues.ImageIFD.Software] = "Piexifjs";
        exif[piexif.TagValues.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10";
        exif[piexif.TagValues.ExifIFD.LensMake] = "LensMake";
        exif[piexif.TagValues.ExifIFD.Sharpness] = 777;
        exif[piexif.TagValues.ExifIFD.LensSpecification] = [[1, 1], [1, 1], [1, 1], [1, 1]];
        gps[piexif.TagValues.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
        gps[piexif.TagValues.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
        var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
        var exifbytes = piexif.dump(exifObj);

        var reader = new FileReader();
        reader.onload = function(e) {
            var inserted = piexif.insert(exifbytes, e.target.result);

            var image = new Image();
            image.src = inserted;
            image.width = 200;
            var el = $("<div></div>").append(image);
            $("#resized").prepend(el);

        };
        reader.readAsDataURL(file);
    }
    
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    </script>

Read Exif Values
----------------

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
                console.log("  " + piexif.Tags[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
            }
        }
    };
    reader.readAsDataURL(file);

Generates Rotated JPEG
----------------------

::

    function postJpeg (binStr) {
        var array = [];
        for (var p=0; p<data.length; p++) {
            array[p] = data.charCodeAt(p);
        }
        var u8array = new Uint8Array(array);

        var req = new XMLHttpRequest();
        req.open("POST", "/jpeg", false);
        req.setRequestHeader('Content-Type', 'image/jpeg');
        req.send(u8array.buffer);
    }


    function previewJpeg(evt) {
        var files = evt.target.files;
        var previewDiv = $("#preview");
        for (var i=0; i<files.length; i++) {
            var file = files[i];
            if (!file.type.match('image/jpeg.*')) {
                continue;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var exif = piexif.load(e.target.result);
                var image = new Image();
                image.onload = function () {
                    var orientation = exif["0th"][piexif.TagValues.ImageIFD.Orientation];

                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    var x = 0;
                    var y = 0;
                    ctx.save();
                    if (orientation == 2) {
                        x = -canvas.width;
                        ctx.scale(-1, 1);
                    } else if (orientation == 3) {
                        x = -canvas.width;
                        y = -canvas.height;
                        ctx.scale(-1, -1);
                    } else if (orientation == 4) {
                        y = -canvas.height;
                        ctx.scale(1, -1);
                    } else if (orientation == 5) {
                        canvas.width = image.height;
                        canvas.height = image.width;
                        ctx.translate(canvas.width, canvas.height / canvas.width);
                        ctx.rotate(Math.PI / 2);
                        y = -canvas.width;
                        ctx.scale(1, -1);
                    } else if (orientation == 6) {
                        canvas.width = image.height;
                        canvas.height = image.width;
                        ctx.translate(canvas.width, canvas.height / canvas.width);
                        ctx.rotate(Math.PI / 2);
                    } else if (orientation == 7) {
                        canvas.width = image.height;
                        canvas.height = image.width;
                        ctx.translate(canvas.width, canvas.height / canvas.width);
                        ctx.rotate(Math.PI / 2);
                        x = -canvas.height;
                        ctx.scale(-1, 1);
                    } else if (orientation == 8) {
                        canvas.width = image.height;
                        canvas.height = image.width;
                        ctx.translate(canvas.width, canvas.height / canvas.width);
                        ctx.rotate(Math.PI / 2);
                        x = -canvas.height;
                        y = -canvas.width;
                        ctx.scale(-1, -1);
                    }
                    ctx.drawImage(image, x, y);
                    ctx.restore();

                    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
                    var jpegBinary = atob(dataURL.split(",")[1]);

                    var div = $("<div></div>");
                    div.append(canvas);
                    var button = $("<button>post this image</button>");
                    button.click(function () {
                        //postJpeg(jpegBinary);
                    });

                    previewDiv.prepend(div).prepend(button);
                };
                image.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    }

    document.getElementById("files").onchange = previewJpeg;

GPS Coordinates
---------------

::

    var lat = 59.43553989213321;
    var lng = 24.73842144012451;
    gpsIfd[piexif.TagValues.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
    gpsIfd[piexif.TagValues.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
    gpsIfd[piexif.TagValues.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gpsIfd[piexif.TagValues.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);


Node.js
-------

::

    var piexif = require("piexifjs");
    var fs = require("fs");

    var filename1 = "in.jpg";
    var filename2 = "out.jpg";

    var jpeg = fs.readFileSync(filename1);
    var data = jpeg.toString("binary");

    var zeroth = {};
    var exif = {};
    var gps = {};
    zeroth[piexif.TagValues.ImageIFD.Make] = "Make";
    zeroth[piexif.TagValues.ImageIFD.XResolution] = [777, 1];
    zeroth[piexif.TagValues.ImageIFD.YResolution] = [777, 1];
    zeroth[piexif.TagValues.ImageIFD.Software] = "Piexifjs";
    exif[piexif.TagValues.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10";
    exif[piexif.TagValues.ExifIFD.LensMake] = "LensMake";
    exif[piexif.TagValues.ExifIFD.Sharpness] = 777;
    exif[piexif.TagValues.ExifIFD.LensSpecification] = [[1, 1], [1, 1], [1, 1], [1, 1]];
    gps[piexif.TagValues.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
    gps[piexif.TagValues.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
    var exifbytes = piexif.dump(exifObj);

    var newData = piexif.insert(exifbytes, data);
    var newJpeg = new Buffer(newData, "binary");
    fs.writeFileSync(filename2, newJpeg);
