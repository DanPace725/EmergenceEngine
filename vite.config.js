// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        dashboard: path.resolve(__dirname, 'analysis/dashboard.html'),
        enhancedDashboard: path.resolve(__dirname, 'analysis/enhanced-dashboard.html')
      }
    }
  },
  optimizeDeps: {
    include: ['pixi.js']
  }
});