/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
  './styles/**/*.css',
    './assets/*.js',
  ],
  
  theme: {
   fontFamily: {
    'sans': ['Poppins', 'sans-serif']
   },

    extend: {
      backgroundImage:{
        'home': "url('/assets/
          bg.png')",
      }
      },
    },
  plugins: [],
  }

