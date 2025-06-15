/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: ["./src/index.html", ,"./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // You can change 'Inter' to your preferred font
      },
      colors: {
        primary: {
          DEFAULT: '#FF6A13', // Main orange
          light: '#FFEFE5',   // Light background
          dark: '#E65A00',    // Darker orange (for hover, etc.)
        },
        accent: '#FFB366',     // Accent orange
        text: {
          DEFAULT: '#23272F',  // Main text color
          muted: '#6B7280',    // Muted/secondary text
        },
        background: {
          DEFAULT: '#FFF8F3',  // Main background
          card: '#FFF5EB',     // Card background
        },
      },
    },
  },
  plugins: [],
}
