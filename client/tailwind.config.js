/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
    darkMode: ['selector', '[data-mode="dark"]'],
    theme: {
        colors: {
            primary: 'rgb(var(--color-primary) / <alpha-value>)',
            text: 'rgb(var(--color-text) / <alpha-value>)',
            success: 'rgb(var(--color-success) / <alpha-value>)',
            info: 'rgb(var(--color-info) / <alpha-value>)',
            warn: 'rgb(var(--color-warn) / <alpha-value>)',
            error: 'rgb(var(--color-error) / <alpha-value>)',
            transparent: 'transparent',
            current: 'currentColor',
        },
        extend: {},
    },
    plugins: [],
};
