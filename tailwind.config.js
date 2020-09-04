const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  experimental: 'all',
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      height: {
        '1/2': 'calc(50vh - 5rem)',
        '1/3': '33vh',
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
}
