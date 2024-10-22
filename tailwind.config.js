/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // Alle Dateien in /pages
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Alle Dateien in /components
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',        // Alle Dateien in /app
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', // Benutzerdefinierte Farben aus globals.css
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
