import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    // '.trycloudflare.com' allows the random quick-tunnel subdomain from
    // `make run-preview` (a fresh one is minted on every run).
    allowedHosts: ['myapp.localhost', 'localhost:8080', '.trycloudflare.com'],
    watch: {
      usePolling: true,
    },

    // hmr: {
    //   clientPort: 443,
    // },
  },
});
