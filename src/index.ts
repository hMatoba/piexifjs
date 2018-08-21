import { Types, Tags, TagValues } from './constants'

export let piexifjs = {
    foo: async () => {
        let x = 1 + 1;
        return x;
    },
    bar: () => {
        let x = 1 + 1;
        return x;
    },
    getType: () =>  {
        return Types.Ascii;
    },
    getTag: () => {
        return Tags["0th"];
    },
    getTagValue: () => {
        return TagValues.ExifIFD.ApertureValue;
    }
};
