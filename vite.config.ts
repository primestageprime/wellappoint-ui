import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/services': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/availability': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/appointment_request': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext'
  }
});
