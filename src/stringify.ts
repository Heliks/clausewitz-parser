import { Struct } from './types';

function pad(str: string, level: number) {
    let r = '';

    for (let i = 0; i < level; i++) {
        r += '\t';
    }

    return r + str;
}

function foo(data: any): string {
    if (typeof data === 'object') {

    }

    // If data contains any white-spaces we are transforming to a string, otherwise we use the
    // default "constant" notation e.g. foo = bar instead of foo = "bar".
    return typeof data === 'string' && /\s/.test(data) ? `"${data}"` : data.toString();
}

export function stringify(obj: Struct, level = 0, pretty = false) {
    let data = '';

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            let val = obj[ key ];

            if (Array.isArray(val)) {
                for (const _ of val) {

                }
            }
            else {
                if (typeof val === 'object') {
                    val = `{\n${stringify(val, level + 1) + pad('}', level)}`;
                }
                // Convert to clausewitz string.
                else if (/\s/.test(val)) {
                    val = `"${val}"`;
                }

                data += pad(`${key} = ${val}\n`, level);
            }
        }
    }

    if (!pretty) {
        data = data.replace(/\n/g, ' ').replace('\t', '').replace(/\s{2,}/g, ' ');
    }

    return data;
}
