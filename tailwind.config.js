
/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: ["./src/index.html", ,"./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1D4ED8',    // brand-blue
          light: '#3B82F6',
          dark: '#1E40AF',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
