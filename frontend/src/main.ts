import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/base.scss'
import router from './router';
import { useThemeStore } from './stores/theme';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router);

// Instantiated eagerly (before mount) so the theme is applied to <html>
// before first paint - see stores/theme.ts for the no-flash mechanics.
useThemeStore(pinia);

app.mount('#app')

// PWA installability. The worker is a deliberate no-op (see public/sw.js);
// registered after load so it never competes with first paint.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-fatal: the app works identically without it.
    });
  });
}
