/**
 * Tailwind CSS 4 Configuration
 * Most theme configuration has been moved to CSS files using @theme directive
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require("tailwindcss-animate"),
  ],
}
