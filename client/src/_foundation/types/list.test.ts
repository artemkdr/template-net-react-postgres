import { describe, expect, it } from 'vitest';
import { convertToList } from './list';

describe('convertToList', () => {
    it('should convert a valid JSON object to a List object', () => {
        const json = {
            page: 1,
            pageSize: 10,
            totalPages: 5,
            total: 50,
            list: [{ id: 1 }, { id: 2 }],
        };

        const result = convertToList<{ id: number }>(json);

        expect(result).toEqual({
            Page: 1,
            PageSize: 10,
            TotalPages: 5,
            Total: 50,
            List: [{ id: 1 }, { id: 2 }],
        });
    });

    it('should use itemConverter if provided', () => {
        const json = {
            page: 1,
            pageSize: 10,
            totalPages: 5,
            total: 50,
            list: [{ id: 1 }, { id: 2, test: 1 }],
        };

        const itemConverter = (item: unknown) => {
            const data = item as { id: number };
            return {
                Id: data?.id,
                Converted: true,
            };
        };

        const result = convertToList<{ Id: number; Converted: boolean }>(
            json,
            itemConverter
        );

        expect(result).toEqual({
            Page: 1,
            PageSize: 10,
            TotalPages: 5,
            Total: 50,
            List: [
                { Id: 1, Converted: true },
                { Id: 2, Converted: true },
            ],
        });
    });

    it('should handle empty list', () => {
        const json = {
            page: 1,
            pageSize: 10,
            totalPages: 1,
            total: 0,
            list: [],
        };

        const result = convertToList(json);

        expect(result).toEqual({
            Page: 1,
            PageSize: 10,
            TotalPages: 1,
            Total: 0,
            List: [],
        });
    });

    it('should throw an error if the JSON object is invalid', () => {
        const json1 = {
            page: 1,
            pageSize: 10,
            totalPages: 5,
            total: 50,
            list: {},
        };
        expect(() => convertToList(json1)).toThrow(
            'Invalid JSON object. Expected a ListResponse object with a list as an array.'
        );

        const json2 = {
            list: 'list',
        };
        expect(() => convertToList(json2)).toThrow(
            'Invalid JSON object. Expected a ListResponse object with a list as an array.'
        );
    });

    it('should throw an error if the JSON object is missing the list property', () => {
        const json = {
            page: 1,
            totalPages: 5,
        };
        expect(() => convertToList(json)).toThrow(
            'Invalid JSON object. Expected a ListResponse object with at least a list property.'
        );
    });

    it('should return a default values if pages data is missing', () => {
        const json = {
            list: [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }, { id: 2 }],
        };

        const result = convertToList<{ id: number }>(json);

        expect(result).toEqual({
            Page: 1,
            PageSize: 5,
            TotalPages: 1,
            Total: 5,
            List: [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }, { id: 2 }],
        });
    });
});
