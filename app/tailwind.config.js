module.exports = {
  content: [
    './src/app/*.{html,ts}',
    './src/app/**/*.{html,ts}',
    './src/app/**/**/*.{html,ts}'
  ],
  theme: {
    fontFamily: {
      'montserrat': 'Montserrat'
    },
    extend: {
      colors: {
        'denim': {
          DEFAULT: '#1E40AF',
          'light': '#3453B7',
        },
        'lavendar': '#857885',
        'gold': '#bfae48',
        'green': '#04724d'
      },

    }
  },
  plugins: [
    require("daisyui")
  ],
}
