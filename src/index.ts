import * as constants from './constants';
import * as utils from './utils';

export const version:string = '2.0.0a';

export const remove = (jpeg:string) => {
    var b64 = false;
    if (jpeg.slice(0, 2) == "\xff\xd8") {
    } else if (jpeg.slice(0, 23) == "data:image/jpeg;base64," || jpeg.slice(0, 22) == "data:image/jpg;base64,") {
        jpeg = utils.atob(jpeg.split(",")[1]);
        b64 = true;
    } else {
        throw ("Given data is not jpeg.");
    }
    
    var segments = utils.splitIntoSegments(jpeg);
    var newSegments = segments.filter(function(segment:string){
      return  !(segment.slice(0, 2) == "\xff\xe1" &&
               segment.slice(4, 10) == "Exif\x00\x00"); 
    });
    
    var new_data = newSegments.join("");
    if (b64) {
        new_data = "data:image/jpeg;base64," + utils.btoa(new_data);
    }

    return new_data;
};


export const insert = (exif:string, jpeg:string) => {
    var b64 = false;
    if (exif.slice(0, 6) != "\x45\x78\x69\x66\x00\x00") {
        throw ("Given data is not exif.");
    }
    if (jpeg.slice(0, 2) == "\xff\xd8") {
    } else if (jpeg.slice(0, 23) == "data:image/jpeg;base64," || jpeg.slice(0, 22) == "data:image/jpg;base64,") {
        jpeg = utils.atob(jpeg.split(",")[1]);
        b64 = true;
    } else {
        throw ("Given data is not jpeg.");
    }

    var exifStr = "\xff\xe1" + utils.pack(">H", [exif.length + 2]) + exif;
    var segments = utils.splitIntoSegments(jpeg);
    var new_data = utils.mergeSegments(segments, exifStr);
    if (b64) {
        new_data = "data:image/jpeg;base64," + utils.btoa(new_data);
    }

    return new_data;
};


export const load = (data:string) => {
    var input_data;
    if (typeof (data) == "string") {
        if (data.slice(0, 2) == "\xff\xd8") {
            input_data = data;
        } else if (data.slice(0, 23) == "data:image/jpeg;base64," || data.slice(0, 22) == "data:image/jpg;base64,") {
            input_data = utils.atob(data.split(",")[1]);
        } else if (data.slice(0, 4) == "Exif") {
            input_data = data.slice(6);
        } else {
            throw ("'load' gots invalid file data.");
        }
    } else {
        throw ("'load' gots invalid type argument.");
    }

    var exif_dict:any = {};
    var exifReader:any = new utils.ExifReader(input_data);
    if (exifReader.tiftag === null) {
        return exif_dict;
    }

    if (exifReader.tiftag.slice(0, 2) == "\x49\x49") {
        exifReader.endian_mark = "<";
    } else {
        exifReader.endian_mark = ">";
    }

    var zerothObj = null;
    var firstObj = null;
    var exifObj = null;
    var interopObj = null;
    var gpsObj = null;
    var thumbnail = null;
    var pointer = utils.unpack(exifReader.endian_mark + "L",
                               exifReader.tiftag.slice(4, 8))[0];
    var zerothObj = exifReader.get_ifd(pointer, "0th");
    //*exif_dict["0th"] = exifReader.get_ifd(pointer, "0th");

    var first_ifd_pointer = zerothObj["first_ifd_pointer"];
    delete zerothObj["first_ifd_pointer"];

    if (zerothObj !== null && 34665 in zerothObj) {
        pointer = zerothObj[34665];
        exifObj = exifReader.get_ifd(pointer, "Exif");
    }
    if (zerothObj !== null && 34853 in zerothObj) {
        pointer = zerothObj[34853];
        gpsObj = exifReader.get_ifd(pointer, "GPS");
    }
    if (exifObj !== null && 40965 in exifObj) {
        pointer = exifObj[40965];
        interopObj = exifReader.get_ifd(pointer, "Interop");
    }
    if (first_ifd_pointer != "\x00\x00\x00\x00") {
        pointer = utils.unpack(exifReader.endian_mark + "L",
                               first_ifd_pointer)[0];
        firstObj = exifReader.get_ifd(pointer, "1st");
        if (firstObj !== null && (513 in firstObj) && (514 in firstObj)) {
            var end = firstObj[513] + firstObj[514];
            var thumb = exifReader.tiftag.slice(firstObj[513], end);
            thumbnail = thumb;
        }
    }

    if (zerothObj !== null) {
        exif_dict['0th'] = zerothObj;
    }
    if (firstObj !== null) {
        exif_dict['1st'] = firstObj;
    }
    if (exifObj !== null) {
        exif_dict['Exif'] = exifObj;
    }
    if (gpsObj !== null) {
        exif_dict['GPS'] = gpsObj;
    }
    if (interopObj !== null) {
        exif_dict['Interop'] = interopObj;
    }
    if (thumbnail !== null) {
        exif_dict['thumbnail'] = thumbnail;
    }
    return exif_dict;
};


export const dump = (exif_dict_original:any) => {
    var TIFF_HEADER_LENGTH = 8;

    var exif_dict = utils.copy(exif_dict_original);
    var header = "Exif\x00\x00\x4d\x4d\x00\x2a\x00\x00\x00\x08";
    var exif_is = false;
    var gps_is = false;
    var interop_is = false;
    var first_is = false;

    var zeroth_ifd,
        exif_ifd,
        interop_ifd,
        gps_ifd,
        first_ifd;
    
    if ("0th" in exif_dict) {
        zeroth_ifd = exif_dict["0th"];
    } else {
        zeroth_ifd = {};
    }
    
    if ((("Exif" in exif_dict) && (Object.keys(exif_dict["Exif"]).length)) ||
        (("Interop" in exif_dict) && (Object.keys(exif_dict["Interop"]).length))) {
        zeroth_ifd[34665] = 1;
        exif_is = true;
        exif_ifd = exif_dict["Exif"];
        if (("Interop" in exif_dict) && Object.keys(exif_dict["Interop"]).length) {
            exif_ifd[40965] = 1;
            interop_is = true;
            interop_ifd = exif_dict["Interop"];
        } else if (Object.keys(exif_ifd).indexOf(constants.TagValues.ExifIFD.InteroperabilityTag.toString()) > -1) {
            delete exif_ifd[40965];
        }
    } else if (Object.keys(zeroth_ifd).indexOf(constants.TagValues.ImageIFD.ExifTag.toString()) > -1) {
        delete zeroth_ifd[34665];
    }

    if (("GPS" in exif_dict) && (Object.keys(exif_dict["GPS"]).length)) {
        zeroth_ifd[constants.TagValues.ImageIFD.GPSTag] = 1;
        gps_is = true;
        gps_ifd = exif_dict["GPS"];
    } else if (Object.keys(zeroth_ifd).indexOf(constants.TagValues.ImageIFD.GPSTag.toString()) > -1) {
        delete zeroth_ifd[constants.TagValues.ImageIFD.GPSTag];
    }
    
    if (("1st" in exif_dict) &&
        ("thumbnail" in exif_dict) &&
        (exif_dict["thumbnail"] != null)) {
        first_is = true;
        exif_dict["1st"][513] = 1;
        exif_dict["1st"][514] = 1;
        first_ifd = exif_dict["1st"];
    }
    
    var zeroth_set = utils._dict_to_bytes(zeroth_ifd, "0th", 0);
    var zeroth_length = (zeroth_set[0].length + Number(exif_is) * 12 + Number(gps_is) * 12 + 4 +
        zeroth_set[1].length);

    var exif_set,
        exif_bytes = "",
        exif_length = 0,
        gps_set,
        gps_bytes = "",
        gps_length = 0,
        interop_set,
        interop_bytes = "",
        interop_length = 0,
        first_set,
        first_bytes = "",
        thumbnail;
    if (exif_is) {
        exif_set = utils._dict_to_bytes(exif_ifd, "Exif", zeroth_length);
        exif_length = exif_set[0].length + Number(interop_is) * 12 + exif_set[1].length;
    }
    if (gps_is) {
        gps_set = utils._dict_to_bytes(gps_ifd, "GPS", zeroth_length + exif_length);
        gps_bytes = gps_set.join("");
        gps_length = gps_bytes.length;
    }
    if (interop_is) {
        var offset = zeroth_length + exif_length + gps_length;
        interop_set = utils._dict_to_bytes(interop_ifd, "Interop", offset);
        interop_bytes = interop_set.join("");
        interop_length = interop_bytes.length;
    }
    if (first_is) {
        var offset = zeroth_length + exif_length + gps_length + interop_length;
        first_set = utils._dict_to_bytes(first_ifd, "1st", offset);
        thumbnail = utils._get_thumbnail(exif_dict["thumbnail"]);
        if (thumbnail.length > 64000) {
            throw ("Given thumbnail is too large. max 64kB");
        }
    }

    var exif_pointer = "",
        gps_pointer = "",
        interop_pointer = "",
        first_ifd_pointer = "\x00\x00\x00\x00";
    if (exif_is) {
        var pointer_value = TIFF_HEADER_LENGTH + zeroth_length;
        var pointer_str = utils.pack(">L", [pointer_value]);
        var key = 34665;
        var key_str = utils.pack(">H", [key]);
        var type_str = utils.pack(">H", [constants.Types["Long"]]);
        var length_str = utils.pack(">L", [1]);
        exif_pointer = key_str + type_str + length_str + pointer_str;
    }
    if (gps_is) {
        var pointer_value = TIFF_HEADER_LENGTH + zeroth_length + exif_length;
        var pointer_str = utils.pack(">L", [pointer_value]);
        var key = 34853;
        var key_str = utils.pack(">H", [key]);
        var type_str = utils.pack(">H", [constants.Types["Long"]]);
        var length_str = utils.pack(">L", [1]);
        gps_pointer = key_str + type_str + length_str + pointer_str;
    }
    if (interop_is) {
        var pointer_value = (TIFF_HEADER_LENGTH +
            zeroth_length + exif_length + gps_length);
        var pointer_str = utils.pack(">L", [pointer_value]);
        var key = 40965;
        var key_str = utils.pack(">H", [key]);
        var type_str = utils.pack(">H", [constants.Types["Long"]]);
        var length_str = utils.pack(">L", [1]);
        interop_pointer = key_str + type_str + length_str + pointer_str;
    }
    if (first_is) {
        var pointer_value = (TIFF_HEADER_LENGTH + zeroth_length +
            exif_length + gps_length + interop_length);
        first_ifd_pointer = utils.pack(">L", [pointer_value]);
        var thumbnail_pointer = (pointer_value + first_set[0].length + 24 +
            4 + first_set[1].length);
        var thumbnail_p_bytes = ("\x02\x01\x00\x04\x00\x00\x00\x01" +
            utils.pack(">L", [thumbnail_pointer]));
        var thumbnail_length_bytes = ("\x02\x02\x00\x04\x00\x00\x00\x01" +
            utils.pack(">L", [thumbnail.length]));
        first_bytes = (first_set[0] + thumbnail_p_bytes +
            thumbnail_length_bytes + "\x00\x00\x00\x00" +
            first_set[1] + thumbnail);
    }

    var zeroth_bytes = (zeroth_set[0] + exif_pointer + gps_pointer +
        first_ifd_pointer + zeroth_set[1]);
    if (exif_is) {
        exif_bytes = exif_set[0] + interop_pointer + exif_set[1];
    }

    return (header + zeroth_bytes + exif_bytes + gps_bytes +
        interop_bytes + first_bytes);
};
