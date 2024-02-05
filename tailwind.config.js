module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
    fontSize: {
      xs: '1vw',
      xl: '2.5vw',
      '2xl': '10vw',
    },
    lineHeight: {
      xs: '100%',
      xl: '80%',
      '2xl': '80%',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
