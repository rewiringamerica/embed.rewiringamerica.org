/** @type {import('tailwindcss').Config} */
import { SUPPORTED_COLORS } from './styleConstants';

module.exports = {
  content: {
    files: ['./src/**/*.{ts,tsx,html}'],
  },
  theme: {
    colors: Object.fromEntries(
      SUPPORTED_COLORS.map(color => [
        color,
        `rgb(var(--${color}) / <alpha-value>)`,
      ]),
    ),
    extend: {
      fontSize: {
        xsm: '0.6875rem', // 11px
        sm: '0.8125rem', // 13px
        base: '1rem', // 16px
        lg: '1.25rem', // 20px
        xl: '1.5rem', // 24px
        '2xl': '1.75rem', // 28px
        '3xl': '2rem', // 32px
        '4xl': '2.25rem', // 36px
      },
      minWidth: {
        24: '6rem', // 96px
        50: '12.5rem', // 200px
      },
    },
  },
  plugins: [],
};
