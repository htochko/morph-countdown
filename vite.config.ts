import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MorphCountdown',
      fileName: 'morph-countdown',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({ 
      insertTypesEntry: true,
      exclude: ['**/*.test.ts', 'tests/**/*']
    }),
  ],
});