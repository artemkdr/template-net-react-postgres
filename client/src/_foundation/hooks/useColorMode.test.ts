import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import useColorMode from './useColorMode';

describe('useColorMode', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = '';
    });

    it('should initialize with light mode by default', () => {
        const { result } = renderHook(() => useColorMode());
        expect(result.current.colorMode).toBe('light');
        expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should initialize with dark mode if prefers-color-scheme is dark', () => {
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        }));

        const { result } = renderHook(() => useColorMode());
        expect(result.current.colorMode).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should initialize with saved theme from localStorage', () => {
        localStorage.setItem('theme', 'dark');
        const { result } = renderHook(() => useColorMode());

        expect(result.current.colorMode).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
