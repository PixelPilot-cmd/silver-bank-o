/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#D70000',
                    hover: '#A50000',
                },
                secondary: {
                    DEFAULT: '#121212',
                    light: '#1E1E1E',
                },
                accent: {
                    DEFAULT: '#C0C0C0',
                    glow: 'rgba(192, 192, 192, 0.5)',
                },
                gold: '#D4AF37',
            },
            fontFamily: {
                main: ['Tajawal', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
