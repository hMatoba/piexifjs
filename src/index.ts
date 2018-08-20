import { Types, Tags, TagValues } from './Constants'

export let foobar = {
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
