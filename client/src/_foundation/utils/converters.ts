/**
 * Converts a given value to an integer.
 *
 * If the value is already a number, it rounds it to the nearest integer.
 * If the value is not a number, it attempts to parse it as an integer with parseInt.
 * If parsing fails, it returns 0.
 *
 * @param value - The value to convert to an integer.
 * @returns The converted integer value.
 */
export const toInt = (value: unknown): number => {
    return typeof value == 'number'
        ? Math.round(value)
        : parseInt(String(value)) || 0;
};

/**
 * Converts a given value to a number.
 *
 * If the value is already a number, it returns it as is.
 * If the value is not a number, it attempts to parse it to a number.
 * If parsing fails, it returns 0.
 *
 * @param value - The value to convert to a number.
 * @returns The converted number value.
 */
export const toNumber = (value: unknown): number => {
    if (typeof value == 'number') return value;
    if (String(value).indexOf('0x') === 0) return parseInt(String(value)) || 0;
    return parseFloat(String(value).split(',').join('.')) || 0;
};

/**
 * Converts a given value to a string.
 * Converts null, undefined and NaN to an empty string.
 *
 * @param value - The value to convert to a string.
 * @returns The converted string value.
 */
export const toString = (value: unknown): string => {
    if (typeof value === 'number' && isNaN(value)) return '';
    if (value === null || value === undefined) return '';
    return String(value);
};
