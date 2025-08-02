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
    port: 80,
    // if you want to disable strict port-checking (auto-increment if 80 is in use):
    strictPort: false,
    proxy: {
      "": {
        target: "https://estilo.ct.ws",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, options) => {
          // before sending to InfinityFree, override the User-Agent
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "User-Agent",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
              "AppleWebKit/537.36 (KHTML, like Gecko) " +
              "Chrome/138.0.0.0 Safari/537.36"
            );
          });
        },
      },
    },
  },
});



