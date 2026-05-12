/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        'black-forest': '#243010',
        'dust-grey':    '#D6D5C9',
        'ash-grey':     '#B9BAA3',
        'ink':          '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
