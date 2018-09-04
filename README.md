Piexifjs
========

[![Build Status](https://travis-ci.org/hMatoba/piexifjs.svg?branch=master)](https://travis-ci.org/hMatoba/piexifjs)

[![CircleCI](https://circleci.com/gh/hMatoba/piexifjs/tree/master.svg?style=svg)](https://circleci.com/gh/hMatoba/piexifjs/tree/master)

Notice and Warning!
-------------------

We are implementing v2.0. This version would include a few big changes. If you won't ready to use, don't update this library.
 
```
npm install piexifjs@1.0.4
```
 
Thank you for using piexifjs!

version 2.0
-----------

- add some arguments type checks 
- stop to support bower
- some data types are changed in exif?

How to Use
----------

[Read the Docs](https://piexifjs.readthedocs.io/en/2.0/index.html)

- *var exifObj = piexif.load(jpegData)* - Get exif data as *object*. *jpegData* must be a *string* that starts with "\data:image/jpeg;base64,"(DataURL), "\\xff\\xd8", or "Exif".
- *var exifStr = piexif.dump(exifObj)* - Get exif as *string* to insert into JPEG.
- *piexif.insert(exifStr, jpegData)* - Insert exif into JPEG. If *jpegData* is DataURL, returns JPEG as DataURL. Else if *jpegData* is binary as *string*, returns JPEG as binary as *string*.
- *piexif.remove(jpegData)* - Remove exif from JPEG. If *jpegData* is DataURL, returns JPEG as DataURL. Else if *jpegData* is binary as *string*, returns JPEG as binary as *string*.

Dependency
----------

No dependency. Piexifjs just needs standard JavaScript environment.

Environment
-----------

Both client-side and server-side. Standard browsers(without IE) and Node.js.

Issues
------

Give me details. Environment, code, input, output. I can do nothing with abstract.

License
-------

This software is released under the MIT License, see LICENSE.txt.
