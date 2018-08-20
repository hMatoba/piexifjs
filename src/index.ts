import { Foo } from './foo'


export let foobar = {
    foo: async () => {
        let x = 1 + 1;
        return x;
    },
    bar: () => {
        let x = 1 + 1;
        return x;
    },
    foobar: () => {
        let foo = new Foo();
        return foo;
    }
};
