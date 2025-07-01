import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'temp',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: false,
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
