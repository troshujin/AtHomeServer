import { computed, readonly, ref } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type InstallPlatform = 'ios' | 'android' | 'desktop';

// Module scope, not inside the composable: Chrome fires
// `beforeinstallprompt` once, early - if nothing is listening by then the
// install prompt is gone for the whole visit. This file is imported by
// NavBar, which mounts with the app, so the listener is in place in time.
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const installed = ref(false);

const detectPlatform = (): InstallPlatform => {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as macOS; the touch check tells them apart.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
};

const platform = detectPlatform();

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
  // (`navigator.standalone` is iOS Safari's equivalent of the media query.)
  const iosStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (window.matchMedia('(display-mode: standalone)').matches || iosStandalone) {
    installed.value = true;
  }
}

/**
 * Install-as-app support. The programmatic prompt (`beforeinstallprompt`)
 * only exists in Chromium browsers, and only on a secure (HTTPS) origin -
 * iOS (every browser there is WebKit) and Firefox install PWAs through a
 * browser-menu action instead, with no JS API at all. So:
 *
 * - `canInstall`: whether to show an install entry point. True when not
 *   already installed and either the native prompt is available or we're on
 *   a mobile platform, where a manual "Add to Home Screen" path always
 *   exists. Desktop without a native prompt stays hidden (desktop Firefox
 *   can't install PWAs at all - the button would be a dead end).
 * - `install()`: runs the native prompt when available and returns true;
 *   returns false when there is none, meaning the caller should show the
 *   manual instructions (see InstallHelpModal) instead.
 */
export default function usePwaInstall() {
  const canInstall = computed(
    () => !installed.value && (deferredPrompt.value !== null || platform !== 'desktop'),
  );

  const install = async (): Promise<boolean> => {
    const promptEvent = deferredPrompt.value;
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') installed.value = true;
    // Either way the event is spent.
    deferredPrompt.value = null;
    return true;
  };

  return {
    canInstall,
    installed: readonly(installed),
    platform,
    install,
  };
}
