import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: __dirname,
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background.ts'),
        popup: path.resolve(__dirname, 'src/popup.ts')
      },
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  }
});
