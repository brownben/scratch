const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        '1/2': 'calc(50vh - 5rem)',
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
}
