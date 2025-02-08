/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use class-based dark mode
  darkMode: 'class', 
  // Make sure to include all paths where Tailwind classes might be used
  content: [
    './index.html',         // If using Vite, your entry HTML
    './src/**/*.{js,ts,jsx,tsx}', // All JS/TS files in src
    // If you have additional folders or components, include them here
  ],
  theme: {
    extend: {
      // Extend or customize default theme here
      // For example:
      // colors: {
      //   brand: {
      //     DEFAULT: '#1da1f2',
      //     dark: '#0c7abf',
      //   },
      // },
    },
  },
  plugins: [
    // If you want extra Tailwind plugins, add them here
    // e.g. require('@tailwindcss/forms'), require('@tailwindcss/typography'), etc.
  ],
};
