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
    data: {
      open: 'headlessui-state~="open"',
    },
    extend: {
      animation: {
        spinnerContainer: 'spin 1.4s linear infinite',
        spinnerIndicator: 'spinnerIndicator 1.4s ease-in-out infinite',
      },
      keyframes: {
        spinnerIndicator: {
          '0%': { 'stroke-dasharray': '1px, 200px', 'stroke-dashoffset': '0' },
          '50%': {
            'stroke-dasharray': '100px, 200px',
            'stroke-dashoffset': '-15px',
          },
          '100%': {
            'stroke-dasharray': '100px, 200px',
            'stroke-dashoffset': '-125px',
          },
        },
      },
      boxShadow: {
        DEFAULT: '0px 0px 15px 0px rgba(0, 0, 0, 0.08)',
        elevation:
          '0px 5px 5px -3px rgba(0, 0, 0, 0.20), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
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
      maxWidth: {
        70: '17.5rem', // 280px
        78: '19.5rem',
      },
      minWidth: {
        24: '6rem', // 96px
        50: '12.5rem', // 200px
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
};
