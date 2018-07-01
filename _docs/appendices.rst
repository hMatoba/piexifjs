==========
Appendices
==========

Exif Data in Piexifjs
---------------------

Each exif tag has appropriate type of the value. BYTE, ASCII, SHORT, or... See the document of Exif.
http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf

+---------------+----------------------+
| **Exif Type** | **JavaScript**       |
+---------------+----------------------+
| BYTE          | int                  |
+---------------+----------------------+
| ASCII         | string               |
+---------------+----------------------+
| SHORT         | int                  |
+---------------+----------------------+
| LONG          | int                  |
+---------------+----------------------+
| RATIONAL      | [int, int]           |
+---------------+----------------------+
| UNDEFINED     | string               |
+---------------+----------------------+
| SRATIONAL     | [int, int]           |
+---------------+----------------------+

If value type is number(BYTE, SHORT, LONG, RATIONAL, or SRATIONAL) and value count is two or more number, it is expressed with *Array*.

+---------------------+-------------------------------+
| BYTE, SHORT, LONG   | [int, int, ...]               |
+---------------------+-------------------------------+
| RATIONAL, SRATIONAL | [[int, int], [int, int], ...] |
+---------------------+-------------------------------+

.. note:: If value type is number and value count is one, *array* that is length one value(e.g. [int]) also be accepted. 
