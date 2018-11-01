=======
Helpers
=======

degrees in *rational*
---------------------

.. js:function:: piexif.helper.GPSHelper.degToDmsRational(degrees)

   Convert degrees(*number*) to *[[deg1, deg2], [min1, min2], [sec1, sec2]]*.

   :param number degrees: degrees
   :return: degrees as *[degrees, minutes, seconds]*
   :rtype: Array

::

    const degreesRat = piexif.helper.GPSHelper.degToDmsRational(63.2);

degrees in *number*
-------------------

.. js:function:: piexif.helper.GPSHelper.dmsRationalToDeg(degrees, direction)

   Convert degrees(*[[deg1, deg2], [min1, min2], [sec1, sec2]]*) to *number*.

   :param Array degrees: degrees in *[[deg1, deg2], [min1, min2], [sec1, sec2]]*
   :param string direction: "N", "E", "W", or "S"
   :return: degrees
   :rtype: number

::

    const degreesNum = piexif.helper.GPSHelper.dmsRationalToDeg([[60, 1], [10, 1], [10, 1]], "S");
