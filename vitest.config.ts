import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['packages/**/tests/**/*.test.ts', 'apps/**/tests/**/*.test.{ts,tsx}'],
    environmentMatchGlobs: [
      ['apps/**/tests/**/*.test.tsx', 'jsdom']
    ]
  }
});
