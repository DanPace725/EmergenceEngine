import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'analysis',
  server: {
    port: 3001,
    open: '/dashboard.html'
  },
  build: {
    outDir: '../dist-analysis',
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, 'dashboard.html')
      }
    }
  }
});
