import type { Config } from 'tailwindcss';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  daisyui: {
    themes: [
      {
        forest: {
          ...require('daisyui/src/theming/themes')['forest'],
          '.bg-base-100': {
            'background-color': 'hsl(0, 10%, 11%)',
          },
          '.bg-base-200': {
            'background-color': 'hsl(0, 13%, 8%)',
          },
        },
      },
    ],
  },
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('daisyui'), require('tailwind-scrollbar')],
} satisfies Config;

export default config;
