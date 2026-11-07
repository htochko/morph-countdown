import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/morph-countdown/',
  root: resolve(import.meta.dirname, 'demo'),
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'demo/index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});