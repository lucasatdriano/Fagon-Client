import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    theme: {
        extend: {
            inset: {
                '1/5': '20%',
                '22': '5.5rem',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                'primary-hover': 'var(--primary-hover)',
                'secondary-hover': 'var(--secondary-hover)',
            },
            fontFamily: {
                sans: ['Open Sans', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            borderWidth: {
                '1': '1px',
            },
            transitionProperty: {
                'rounded-and-color': 'border-radius, border-color',
            },
        },
    },
    safelist: [],
    plugins: [],
} satisfies Config;
