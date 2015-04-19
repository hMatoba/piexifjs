==============
About Piexifjs
==============

What for?
---------

Exif manipulations in JS. Writing, reading, and more...

How to Use
----------

There are only just four functions.

- *load(jpegData)* - Get exif data as *object*.
- *dump(exifObj)* - Get exif binary as *string* to insert into JPEG.
- *insert(exifbytes, jpegData)* - Insert exif into JPEG.
- *remove(jpegData)* - Remove exif from JPEG.

Dependency
----------

No dependencies.

Environment
-----------

Tested on IE11, Opera28, and PhantomJS 1.9.8. It runs on even Node.js.

License
-------

The MIT License (MIT)

Copyright (c) 2015 hMatoba

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.