import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: false,
    sourcemap: true
  }
});
