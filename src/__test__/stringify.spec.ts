import { stringify } from '../stringify';

describe('stringify', () => {
    it('should stringify primitive properties', () => {
        const text = stringify({
            a: 'Foobar',
            b: 10
        });

        expect(text.trim()).toBe(`a = Foobar b = 10`);
    });

    it('should convert values to a clausewitz string if they contain spaces', () => {
        const text = stringify({
            test: 'Hello World'
        });

        expect(text.trim()).toBe(`test = "Hello World"`);
    });

    it('should stringify objects', () => {
       const text = stringify({
           test: {
               prop1: 'Foo',
               prop2: { test: 'Hello' },
               prop3: { test: 'World' }
           }
       });

       expect(text.trim()).toBe(
           'test = { prop1 = Foo prop2 = { test = Hello } prop3 = { test = World } }'
       );
    });

    it.only('should stringify arrays', () => {
        const text = stringify({
            // test: [1, "foo", { test: 'foo' }],
            prop1: 'Foo',
            prop2: { test: 'Hello' },
            prop3: { test: 'World' }
        });

        console.log(text)

    });
});

