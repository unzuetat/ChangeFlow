/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cf: {
          50:  '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          300: '#5A9ADE',
          400: '#378ADD',
          500: '#185FA5',
          600: '#0C447C',
          700: '#0A3A6B',
          800: '#042C53',
          900: '#021D38',
        },
        stage: {
          request:   '#868e96',
          classify:  '#ae3ec9',
          assess:    '#f76707',
          approve:   '#1098ad',
          implement: '#4263eb',
          review:    '#2b8a3e',
          close:     '#495057',
        },
        risk: {
          low:      '#639922',
          medium:   '#BA7517',
          high:     '#A32D2D',
          critical: '#791F1F',
        },
        scope: {
          project:     '#185FA5',
          operational: '#0F6E56',
          cross:       '#993556',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '4px',
        'lg': '4px',
        'xl': '4px',
      },
    },
  },
  plugins: [],
};
