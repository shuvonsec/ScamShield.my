import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        content: 'src/content.ts',
        popup: 'src/popup.tsx'
      },
      output: {
        entryFileNames: (chunk) => `${chunk.name}.js`
      }
    }
  }
});
