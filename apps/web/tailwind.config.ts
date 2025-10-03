import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        safe: '#0f9d58',
        suspicious: '#f4b400',
        malicious: '#db4437'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
