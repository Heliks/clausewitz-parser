import { parse } from '../parse';

describe('parse', () => {
    it('should parse integers', () => {
        expect(parse(`test = 100`).test).toBe(100);
    });

    it('should parse constants', () => {
        expect(parse(`test = MY_CONSTANT`).test).toBe('MY_CONSTANT');
    });

    it('should parse floats', () => {
        const result = parse(`
            test1 = 0.5 
            test2 = .5
        `);

        expect(result.test1).toBe(0.5);
        expect(result.test2).toBe(0.5);
    });

    it('should parse objects', () => {
        const result = parse(`
            foo = {
                prop1 = Hello
                prop2 = World
            }
        `);

        expect(result.foo.prop1).toBe("Hello");
        expect(result.foo.prop2).toBe("World");
    });

    it('should parse strings', () => {
        expect(parse(`test = "Foobar"`).test).toBe('Foobar');
    });

    it('should parse booleans', () => {
        const result = parse(`a = yes b = no`);

        expect(result.a).toBe(true);
        expect(result.b).toBe(false);
    });

    it('should throw if string is unterminated', () => {
        expect(() => {
            parse('test = "Unterminated String')
        }).toThrowError();
    });

    it('should throw if string is multiline', () => {
        expect(() => {
            parse(`
                test = "Multi
                line string"
            `);
        }).toThrowError();
    });

    it('should parse nested objects', () => {
        const result = parse(`
            root = {
                prop1 = Hello
                child = {
                    prop1 = Hello
                    prop2 = World
                }
                prop2 = World
            }
        `);

        // This is to also verify that properties were parsed correctly
        // before and after context switching.
        expect(result.root.prop1).toBe('Hello');
        expect(result.root.prop2).toBe('World');

        // Verify child properties.
        expect(result.root.child.prop1).toBe('Hello');
        expect(result.root.child.prop2).toBe('World');
    });

    it('should parse arrays', () => {
        const result = parse(`
            arr = Hello
            arr = World
        `);

        expect(
            Array.isArray(result.arr)
        ).toBeTruthy();

        expect(result.arr[0]).toBe('Hello');
        expect(result.arr[1]).toBe('World');
    });

    it('should parse arrays containing objects', () => {
        const result = parse(`
            arr = {
                prop1 = Foo
                prop2 = Bar
            }
            arr = {
                prop1 = Foo
                prop2 = Bar
            }
        `);

        expect(result.arr[0].prop1).toBe('Foo');
        expect(result.arr[0].prop2).toBe('Bar');

        expect(result.arr[1].prop1).toBe('Foo');
        expect(result.arr[1].prop2).toBe('Bar');
    });

    it('should parse nested arrays', () => {
        const result = parse(`
            arr = {
                test = Foo
                test = Bar    
            }
            arr = {
                test = Foo
                test = Bar
            }
        `);

        expect(result.arr[0].test[0]).toBe('Foo');
        expect(result.arr[0].test[1]).toBe('Bar');
        expect(result.arr[1].test[0]).toBe('Foo');
        expect(result.arr[1].test[1]).toBe('Bar');
    });
});
