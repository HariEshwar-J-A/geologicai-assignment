/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      screens: {
        mobile: '640px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
