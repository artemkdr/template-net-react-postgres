import { useCallback, useEffect, useState } from 'react';

const useColorMode = () => {
    const [colorMode, setThemeMode] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.classList.add(savedTheme);
            setThemeMode(savedTheme as 'dark' | 'light');
        } else {
            const prefersDarkScheme =
                typeof window.matchMedia === 'function' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkScheme) {
                document.documentElement.classList.add('dark');
                setThemeMode('dark');
            } else {
                document.documentElement.classList.add('light');
                setThemeMode('light');
            }
        }
    }, []);

    const toggleColorMode = useCallback(() => {
        const cls = document.documentElement.classList;
        if (cls.contains('dark')) {
            cls.remove('dark');
            cls.add('light');
            localStorage.setItem('theme', 'light');
            setThemeMode('light');
        } else {
            cls.remove('light');
            cls.add('dark');
            localStorage.setItem('theme', 'dark');
            setThemeMode('dark');
        }
    }, []);

    return { colorMode, toggleColorMode };
};

export default useColorMode;
