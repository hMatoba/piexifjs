==============
About Piexifjs
==============

Notice and Warning!
-------------------

We are implementing v2.0. This version would include a few big changes. If you won't ready to use, don't update this library.

- add some arguments type checks 
- stop to support bower
- some data types are changed in exif object...?

Some names in this libary will be changed until beta version.

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

and some utilities.

Dependency
----------

No dependencies.

Environment
-----------

Both client-side and server-side. Piexifjs is transpiled as `Universal Module Definition <https://github.com/umdjs/umd>`_.

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