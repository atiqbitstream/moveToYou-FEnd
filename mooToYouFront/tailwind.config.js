/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':{
          light: '#5eead4',   // Teal variant
          DEFAULT: '#14b8a6', // Base primary
          dark: '#0f766e'     // Dark variant

        },
        'secondary':{
          light: '#94a3b8',   // Slate light
          DEFAULT: '#64748b', // Slate base
          dark: '#475569'     // Slate dark
        }
      },
      fontFamily:{
        'sans': ['Inter', 'system-ui'],
        'display': ['Outfit']
      },
      spacing: {
        'container': '1rem',
        'section': '2rem'
      }
    },
  },
  plugins: [],
}

