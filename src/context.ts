import { Struct } from './types';

export class Context {

    /**
     * @param data (optional) The data contained in this context.
     * @param parent (optional) Parent context.
     */
    constructor(
        public readonly data: Struct = {},
        public readonly parent?: Context
    ) {}

    /**
     * Adds a new `key` with the given `value` to {@link data}. If it already exists
     * it is converted to an array and `value` will be added to it alongside the
     * previous value.e
     */
    public setData(key: string, value: unknown) {
        let data = this.data[ key ];

        // If a key is set for the second time the initial value is converted to an array
        // containing the old value and the value passed as parameter to this function.
        if (data) {
            // If the key was already converted to an array we can just add the new value to it.
            if (Array.isArray(data)) {
                data.push(value);
            }
            else {
                this.data[ key ] = [
                    data,
                    value
                ];
            }
        }
        else {
            this.data[ key ] = value;
        }
    }

    /** Adds a new child object and returns a new `Context` for it. */
    public setChild(key: string): Context {
        const data = {};

        this.setData(key, data);

        return new Context(data, this);
    }

}
