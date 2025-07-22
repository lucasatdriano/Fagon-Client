import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    theme: {
        screens: {
            xs: '400px',
            sm: '660px',
            md: '768px',
            ml: '896px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            padding: {
                '18': '4.5rem',
            },
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
                error: 'var(--error)',
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
    safelist: [
        'bg-orange-100',
        'text-orange-800',
        'bg-blue-100',
        'text-blue-800',
        'bg-yellow-100',
        'text-yellow-800',
        'bg-purple-100',
        'text-purple-800',
        'bg-green-100',
        'text-green-800',
        'bg-red-100',
        'text-red-800',
        'bg-sky-100',
        'text-sky-800',
        'bg-lime-100',
        'text-lime-800',
    ],
    plugins: [],
} satisfies Config;
