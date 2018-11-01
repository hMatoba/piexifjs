=========
Constants
=========

To set exif values
------------------

0th IFD and 1st IFD: *piexifjs.TagValues.ImageIFD*

Exif IFD: *piexifjs.TagValues.ExifIFD*

GPS IFD: *piexifjs.TagValues.GPSIFD*

Interoperability IFD: *piexifjs.TagValues.InteropIFD*

::

    let zerothIfd = {
        [piexifjs.TagValues.ImageIFD.ProcessingSoftware]:'piexifjs',
        [piexifjs.ImageIFD.XResolution]:[777, 1],
        [piexifjs.ImageIFD.YResolution]:[777, 1],
        [piexifjs.ImageIFD.Software]:"Piexifjs"
    };
    let exifIfd = {
        [piexifjs.TagValues.ExifIFD.DateTimeOriginal]:"2010:10:10 10:10:10",
        [piexifjs.TagValues.ExifIFD.LensMake]:"LensMake",
        [piexifjs.TagValues.ExifIFD.Sharpness]:777,
        [piexifjs.TagValues.ExifIFD.LensSpecification]:[[1, 1], [1, 1], [1, 1], [1, 1]]
    };
    let gpsIfd = {
        [piexifjs.TagValues.GPSIFD.GPSVersionID]:[7, 7, 7, 7],
        [piexifjs.TagValues.GPSIFD.GPSDateStamp]:"1999:99:99 99:99:99"
    };
    let exifObj = {"0th":zerothIfd, "Exif":exifIfd, "GPS":gpsIfd};


To read exif keys
-----------------

in *piexifjs.Tags*

::

    let exifObj = piexifjs.load(exifBinary);
    for (let ifd in exifObj) {
        if (ifd == "thumbnail") {
            continue;
        }
        console.log("-" + ifd);
        for (let tag in exifObj[ifd]) {
            console.log("  " + piexif.Tags[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
        }
    }