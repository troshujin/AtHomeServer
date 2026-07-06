import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    // '.trycloudflare.com' allows the random quick-tunnel subdomain from
    // `make run-preview` (a fresh one is minted on every run). PUBLIC_HOST
    // (set in docker-compose / the repo-root .env) is the real domain the
    // Proxmox gateway serves the app under - without it here, vite's
    // Host-header check rejects every request the gateway forwards.
    allowedHosts: [
      'myapp.tijmensimons.nl',
      'localhost:8080',
      '.trycloudflare.com',
      ...(process.env.PUBLIC_HOST ? [process.env.PUBLIC_HOST] : []),
    ],
    watch: {
      usePolling: true,
    },

    // hmr: {
    //   clientPort: 443,
    // },
  },
});
