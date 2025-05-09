import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                hover: 'var(--hover)',
            },
            fontFamily: {
                sans: ['var(--font-open-sans)', 'sans-serif'],
                montserrat: ['var(--font-montserrat)', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            transitionProperty: {
                'rounded-and-color': 'border-radius, border-color',
            },
        },
    },
    plugins: [],
} satisfies Config;
