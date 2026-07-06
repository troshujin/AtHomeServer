import { readonly, ref } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Module scope, not inside the composable: Chrome fires
// `beforeinstallprompt` once, early - if nothing is listening by then the
// install prompt is gone for the whole visit. This file is imported by
// NavBar, which mounts with the app, so the listener is in place in time.
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const installed = ref(false);

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt.value = event as BeforeInstallPromptEvent;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null;
    installed.value = true;
  });

  // Already running as an installed app - never offer the button.
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installed.value = true;
  }
}

/**
 * Install-as-app support. `canInstall` is only true when the browser has
 * actually offered installability (so the button self-hides on iOS Safari,
 * which has no prompt API, and in already-installed windows).
 */
export default function usePwaInstall() {
  const install = async () => {
    const promptEvent = deferredPrompt.value;
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') installed.value = true;
    // Either way the event is spent.
    deferredPrompt.value = null;
  };

  return {
    canInstall: readonly(deferredPrompt),
    installed: readonly(installed),
    install,
  };
}
