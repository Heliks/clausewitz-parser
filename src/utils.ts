/** Returns `true` if `val` contains only characters from a-z or underscores. */
export function isAlphaUnderscore(val: string): boolean {
    return /^[a-zA-Z_]*$/.test(val);
}

/** Returns `true` if `val` contains only characters from a-z, digits or underscores. */
export function isAlphaNumericUnderscore(val: string): boolean {
    return /^[a-zA-Z0-9_]*$/.test(val);
}

/** Returns `true` if `val` is a valid number (float or int). */
export function isNumber(val: string): boolean {
    return /^[+-]?([0-9]*[.])?[0-9]*$/.test(val);
}

