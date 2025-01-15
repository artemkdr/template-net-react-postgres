import { toInt, toNumber, toString } from './converters';

describe('converters', () => {
    describe('toInt', () => {
        it('should convert a number to an integer', () => {
            expect(toInt(4.7)).toBe(5);
            expect(toInt(4)).toBe(4);
        });

        it('should convert a string to an integer', () => {
            expect(toInt('4.7')).toBe(4);
            expect(toInt('4')).toBe(4);
            expect(toInt('0')).toBe(0);
            expect(toInt('-0')).toBe(0);
            expect(toInt('0xFF')).toBe(255);
        });

        it('should return 0 for non-numeric values', () => {
            expect(toInt('abc')).toBe(0);
            expect(toInt(null)).toBe(0);
            expect(toInt(undefined)).toBe(0);
        });
    });

    describe('toNumber', () => {
        it('should return the number as is', () => {
            expect(toNumber(4.7)).toBe(4.7);
            expect(toNumber(4)).toBe(4);
        });

        it('should convert a string to a number', () => {
            expect(toNumber('4.7')).toBe(4.7);
            expect(toNumber('4,7')).toBe(4.7);
            expect(toNumber('4')).toBe(4);
            expect(toNumber('4e18')).toBe(4e18);
            expect(toNumber('4e+18')).toBe(4e18);
            expect(toNumber('4e180')).toBe(4e180);
            expect(toNumber('4e+180')).toBe(4e180);
            expect(toNumber('0.1')).toBeCloseTo(0.1);
            expect(toNumber('-0.1')).toBeCloseTo(-0.1);
            expect(toNumber('0')).toBe(0);
            expect(toNumber('-0')).toBe(0);
            expect(toNumber('Infinity')).toBe(Infinity);
            expect(toNumber('-Infinity')).toBe(-Infinity);
            expect(toNumber('0xFF')).toBe(255);
        });

        it('should return 0 for non-numeric values', () => {
            expect(toNumber('abc')).toBe(0);
            expect(toNumber(null)).toBe(0);
            expect(toNumber(undefined)).toBe(0);
        });
    });

    describe('toString', () => {
        it('should convert a number to a string', () => {
            expect(toString(4.7)).toBe('4.7');
            expect(toString(4)).toBe('4');
        });

        it('should convert a boolean to a string', () => {
            expect(toString(true)).toBe('true');
            expect(toString(false)).toBe('false');
        });

        it('should convert null and undefined and NaN to an empty string', () => {
            expect(toString(null)).toBe('');
            expect(toString(undefined)).toBe('');
            expect(toString(NaN)).toBe('');
        });

        it('should return the string as is', () => {
            expect(toString('abc')).toBe('abc');
        });
    });
});
