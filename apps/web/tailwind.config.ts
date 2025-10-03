import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        safe: '#0EA5E9',
        suspicious: '#F97316',
        malicious: '#EF4444'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
