/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./views/**/*.ejs", // Scans all EJS templates in the 'views' subdirectory
    "./*.ejs", // Scans any EJS templates in the root directory

    "./script.js", // Scans your static JavaScript file for classes applied dynamically
    "./dist/*.html", // Scans the generated HTML file (e.g., dist/index.html)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
