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

    let exifObj = piexif.load(jpegData);
    for (let ifd in exifObj) {
        if (ifd == "thumbnail") {
            continue;
        }
        console.log("-" + ifd);
        for (let tag in exifObj[ifd]) {
            console.log("  " + piexif.Tags[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
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

    let zeroth = {};
    let exif = {};
    let gps = {};
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
    let exifObj = {"0th":zeroth, "Exif":exif, "GPS":gps};
    const exifbytes = piexif.dump(exifObj);

Properties of *piexif.TagValues.ImageIFD* help to make 0thIFD and 1stIFD. *piexif.TagValues.ExifIFD* is for ExifIFD. *piexif.TagValues.GPSIFD* is for GPSIFD. *piexif.InteropIFD* is for InteroperabilityIFD.

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

    const exifbytes = piexif.dump(exifObj)
    const newJpeg = piexif.insert(exifbytes, jpegData)

remove
------
.. js:function:: piexif.remove(jpegData)

   Remove exif from JPEG.

   :param string jpegData: JPEG data
   :return: JPEG data
   :rtype: string

::

    const newJpeg = piexif.remove(jpegData)
