/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60A5FA', // blue-400: Medium light blue
          hover: '#3B82F6',   // blue-500: Slightly deeper light blue
        },
        secondary: {
          DEFAULT: '#93C5FD', // blue-300: Light blue
          hover: '#60A5FA',   // blue-400: Medium hover state
        },
        accent: {
          DEFAULT: '#DBEAFE', // blue-100: Soft blue tint
          hover: '#BFDBFE',   // blue-200: Light hover state
        }
      }
    },
  },
  plugins: [],
};
