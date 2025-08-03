import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env.REACT_ROUTER_FUTURE': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true
    })
  },
  server: {
    // bind to all network interfaces (so you can access via localhost or LAN IP)
    host: true,
    // default HTTP port
    port: 8000,
    // if you want to disable strict port-checking (auto-increment if 80 is in use):
    strictPort: false,
  },
});



