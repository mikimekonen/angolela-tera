import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 35000,
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
