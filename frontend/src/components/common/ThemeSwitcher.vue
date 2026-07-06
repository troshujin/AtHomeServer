<template>
  <div class="theme-switcher">
    <ThemeToggle />
    <button
      class="theme-switcher__chevron"
      type="button"
      aria-label="Open theme menu"
      :aria-expanded="themeStore.isPickerOpen"
      @click="themeStore.openPicker()"
    >
      <span aria-hidden="true">▾</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.theme-switcher__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.7rem;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.theme-switcher__chevron:hover {
  opacity: 1;
  transform: translateY(1px);
}

@media (prefers-reduced-motion: reduce) {
  .theme-switcher__chevron {
    transition: none;
  }
}
</style>
