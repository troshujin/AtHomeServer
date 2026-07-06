<template>
  <Teleport to="body">
    <Transition name="theme-menu-backdrop">
      <div
        v-if="themeStore.isPickerOpen"
        class="theme-menu-backdrop"
        @click.self="themeStore.closePicker()"
      >
        <Transition name="theme-menu-panel" appear>
          <div class="theme-menu" role="dialog" aria-modal="true" aria-label="Choose a theme">
            <header class="theme-menu__header">
              <h2 class="theme-menu__title">Choose a theme</h2>
              <button
                class="theme-menu__close"
                type="button"
                aria-label="Close theme menu"
                @click="themeStore.closePicker()"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>

            <ul class="theme-menu__grid">
              <li v-for="definition in THEMES" :key="definition.id">
                <button
                  class="theme-menu__option"
                  :class="{ 'is-active': definition.id === themeStore.theme }"
                  type="button"
                  @click="select(definition.id)"
                >
                  <span class="theme-menu__option-icon" aria-hidden="true">{{ definition.icon }}</span>
                  <span class="theme-menu__option-name">{{ definition.name }}</span>
                  <span v-if="definition.id === themeStore.theme" class="theme-menu__option-check" aria-hidden="true">
                    &check;
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { THEMES, useThemeStore, type ThemeName } from '@/stores/theme';

const themeStore = useThemeStore();

const select = (id: ThemeName): void => {
  themeStore.setTheme(id);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') themeStore.closePicker();
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<style scoped>
.theme-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

@media (min-width: 641px) {
  .theme-menu-backdrop {
    align-items: center;
  }
}

.theme-menu {
  width: 100%;
  max-width: 26rem;
  max-height: min(32rem, 80vh);
  overflow-y: auto;
  padding: 1.25rem;
  background: var(--glass-bg-solid);
  border: 1px solid var(--surface-border);
  box-shadow: var(--surface-shadow-lg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

@media (min-width: 641px) {
  .theme-menu {
    border-radius: var(--radius-lg);
    margin-bottom: 0;
  }
}

.theme-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.theme-menu__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.theme-menu__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: rgba(var(--overlay-rgb), 0.06);
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.theme-menu__close:hover {
  background: rgba(var(--overlay-rgb), 0.1);
}

.theme-menu__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 420px) {
  .theme-menu__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.theme-menu__option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.9rem 0.5rem;
  border: 1.5px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease, background-color 0.15s ease;
}

.theme-menu__option:hover {
  background: rgba(var(--overlay-rgb), 0.08);
}

.theme-menu__option:active {
  transform: scale(0.96);
}

.theme-menu__option.is-active {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
}

.theme-menu__option-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.theme-menu__option-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

.theme-menu__option-check {
  position: absolute;
  top: 0.35rem;
  right: 0.45rem;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 700;
}

.theme-menu-backdrop-enter-active,
.theme-menu-backdrop-leave-active {
  transition: opacity 0.18s ease;
}

.theme-menu-backdrop-enter-from,
.theme-menu-backdrop-leave-to {
  opacity: 0;
}

.theme-menu-panel-enter-active,
.theme-menu-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.theme-menu-panel-enter-from,
.theme-menu-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .theme-menu-backdrop-enter-active,
  .theme-menu-backdrop-leave-active,
  .theme-menu-panel-enter-active,
  .theme-menu-panel-leave-active,
  .theme-menu__option,
  .theme-menu__close {
    transition: none !important;
  }
}
</style>
