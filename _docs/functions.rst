=========
Functions
=========

.. warning:: It could set any value in exif without actual value. For example, actual XResolution is 300, whereas XResolution value in exif is 0. Confliction might happen.
.. warning:: To edit exif tags and values appropriately, read official document from P167-. http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf


load
----

.. js:function:: piexif.load(jpegData)

   Get exif data as *object*. jpegData must be a *string* that starts with "\data:image/jpeg;base64,"(DataURL), "\\xff\\xd8", or "Exif".

   :param string jpegData: JPEG data
   :return: Exif data({"0th":object, "Exif":object, "GPS":object, "Interop":object, "1st":object, "thumbnail":string})
   :rtype: object

::

    var exifObj = piexif.load(jpegData);
    for (var ifd in exifObj) {
        if (ifd == "thumbnail") {
            continue;
        }
        console.log("-" + ifd);
        for (var tag in exifObj[ifd]) {
            console.log("  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
        }
    }

dump
----

.. js:function:: piexif.dump(exifObj)

   Get exif binary as *string* to insert into JPEG.

   :param object exifObj: Exif data({"0th":0thIFD - object, "Exif":ExifIFD - object, "GPS":GPSIFD - object, "Interop":InteroperabilityIFD - object, "1st":1stIFD - object, "thumbnail":JPEG data - string})
   :return: Exif binary
   :rtype: string

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
    var exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
    var exifbytes = piexif.dump(exifObj);

Properties of *piexif.ImageIFD* help to make 0thIFD and 1stIFD. *piexif.ExifIFD* is for ExifIFD. *piexif.GPSIFD* is for GPSIFD. *piexif.InteropIFD* is for InteroperabilityIFD.

.. note:: ExifTag(34665), GPSTag(34853), and InteroperabilityTag(40965) in 0thIFD automatically are set appropriate value.
.. note:: JPEGInterchangeFormat(513), and JPEGInterchangeFormatLength(514) in 1stIFD automatically are set appropriate value.
.. note:: If 'thumbnail' is contained in *exifObj*, '1st' must be contained -- and vice versa. 1stIFD means thumbnail's information.

insert
------
.. js:function:: piexif.insert(exifbytes, jpegData)

   Insert exif into JPEG.

   :param string exifbytes: Exif binary
   :param string jpegData: JPEG data
   :return: JPEG data
   :rtype: string

::

    var exifbytes = piexif.dump(exifObj)
    var newJpeg = piexif.insert(exifbytes, jpegData)

remove
------
.. js:function:: piexif.remove(jpegData)

   Remove exif from JPEG.

   :param string jpegData: JPEG data
   :return: JPEG data
   :rtype: string

::

    var newJpeg = piexif.remove("foo.jpg")
