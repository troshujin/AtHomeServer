<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="`Current theme: ${currentTheme.name}. Click to switch light/dark, or click rapidly to open the theme menu.`"
    @click="handleClick"
  >
    <span aria-hidden="true">{{ currentTheme.icon }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getThemeDefinition, useThemeStore } from '@/stores/theme';

// Clicking rapidly (SPAM_THRESHOLD times within SPAM_WINDOW_MS) opens the
// full theme picker instead of toggling - a hidden-but-discoverable shortcut
// to the other 9 themes, since a single click is reserved for the quick
// light/dark swap. See frontend/docs/STYLE_GUIDE.md "Theming."
const SPAM_THRESHOLD = 8;
const SPAM_WINDOW_MS = 1500;

const themeStore = useThemeStore();
const currentTheme = computed(() => getThemeDefinition(themeStore.theme));

let recentClicks: number[] = [];

const handleClick = () => {
  const now = Date.now();
  recentClicks = [...recentClicks, now].filter((time) => now - time <= SPAM_WINDOW_MS);

  if (recentClicks.length >= SPAM_THRESHOLD) {
    recentClicks = [];
    themeStore.openPicker();
    return;
  }

  themeStore.toggleTheme();
};
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: var(--radius-pill);
  background: rgba(var(--overlay-rgb), 0.05);
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.theme-toggle:hover {
  background: rgba(var(--overlay-rgb), 0.09);
}

.theme-toggle:active {
  transform: scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;
  }
}
</style>
