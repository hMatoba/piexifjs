=========
Constants
=========

To set exif values
------------------

0th IFD and 1st IFD: *piexif.TagValues.ImageIFD*

Exif IFD: *piexif.TagValues.ExifIFD*

GPS IFD: *piexif.TagValues.GPSIFD*

Interoperability IFD: *piexif.TagValues.InteropIFD*

::

    let zerothIfd = {
        [piexif.TagValues.ImageIFD.ProcessingSoftware]:'piexifjs',
        [piexif.TagValues.ImageIFD.XResolution]:[777, 1],
        [piexif.TagValues.ImageIFD.YResolution]:[777, 1],
        [piexif.TagValues.ImageIFD.Software]:"Piexifjs"
    };
    let exifIfd = {
        [piexif.TagValues.ExifIFD.DateTimeOriginal]:"2010:10:10 10:10:10",
        [piexif.TagValues.ExifIFD.LensMake]:"LensMake",
        [piexif.TagValues.ExifIFD.Sharpness]:777,
        [piexif.TagValues.ExifIFD.LensSpecification]:[[1, 1], [1, 1], [1, 1], [1, 1]]
    };
    let gpsIfd = {
        [piexif.TagValues.GPSIFD.GPSVersionID]:[7, 7, 7, 7],
        [piexif.TagValues.GPSIFD.GPSDateStamp]:"1999:99:99 99:99:99"
    };
    let exifObj = {"0th":zerothIfd, "Exif":exifIfd, "GPS":gpsIfd};


To read exif keys
-----------------

in *piexif.Tags*

::

    let exifObj = piexif.load(exifBinary);
    for (let ifd in exifObj) {
        if (ifd == "thumbnail") {
            continue;
        }
        console.log("-" + ifd);
        for (let tag in exifObj[ifd]) {
            console.log("  " + piexif.Tags[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
        }
    }