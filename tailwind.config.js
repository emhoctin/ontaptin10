/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#F59E0B',
        accent: '#F59E0B',
        light: '#F3F4F6',
        dark: '#1F2937',
        success: '#10B981',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
