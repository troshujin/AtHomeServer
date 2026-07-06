import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface ThemeDefinition {
  id: string;
  name: string;
  /** Emoji shown on the compact toggle when this theme is active. */
  icon: string;
}

// The full catalog. A theme isn't "real" until it's both here (id, display
// name, icon) and has a matching `[data-theme='id']` block in
// src/styles/_themes.scss - see frontend/docs/STYLE_GUIDE.md "Theming."
export const THEMES: ThemeDefinition[] = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'aurora', name: 'Aurora', icon: '🌌' },
  { id: 'sunset', name: 'Sunset Blvd', icon: '🌇' },
  { id: 'evergreen', name: 'Evergreen', icon: '🌲' },
  { id: 'abyss', name: 'Abyss', icon: '🌊' },
  { id: 'candy', name: 'Cotton Candy', icon: '🍬' },
  { id: 'neon-grid', name: 'Neon Grid', icon: '🌆' },
  { id: 'rose-gold', name: 'Rose Gold', icon: '🌹' },
  { id: 'magma', name: 'Magma', icon: '🌋' },
  { id: 'nordic-frost', name: 'Nordic Frost', icon: '❄️' },
];

export type ThemeName = (typeof THEMES)[number]['id'];

const THEME_IDS = new Set<string>(THEMES.map((theme) => theme.id));

export const getThemeDefinition = (id: string): ThemeDefinition =>
  THEMES.find((theme) => theme.id === id) ?? THEMES[0]!;

const STORAGE_KEY = 'athomeserver:theme';

const getStoredTheme = (): ThemeName | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && THEME_IDS.has(stored) ? stored : null;
};

const getSystemTheme = (): ThemeName =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyThemeAttribute = (value: ThemeName): void => {
  document.documentElement.dataset.theme = value;
};

// Runs once, at module load. main.ts imports this store before mounting the
// app, so the right [data-theme] is on <html> before first paint - no flash
// of the wrong theme.
const initialTheme: ThemeName = getStoredTheme() ?? getSystemTheme();
applyThemeAttribute(initialTheme);

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeName>(initialTheme);
  const isPickerOpen = ref(false);

  const setTheme = (value: ThemeName): void => {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
    applyThemeAttribute(value);
  };

  /** Quick light/dark swap - ignores which of the 9 extra themes is active. */
  const toggleTheme = (): void => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  const openPicker = (): void => {
    isPickerOpen.value = true;
  };

  const closePicker = (): void => {
    isPickerOpen.value = false;
  };

  // Follow the OS theme live, but only until the user makes an explicit
  // choice via setTheme/toggleTheme - after that we respect their choice.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (getStoredTheme()) return;
    theme.value = event.matches ? 'dark' : 'light';
    applyThemeAttribute(theme.value);
  });

  return { theme, isPickerOpen, setTheme, toggleTheme, openPicker, closePicker };
});
