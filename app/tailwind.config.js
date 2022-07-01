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
        'denim': '#1E40AF',
        'lavendar': '#857885',
        'gold': '#bfae48',
        'green': '#04724d'
      },

    }
  },
  plugins: [],
}
