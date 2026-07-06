<template>
  <component
    :is="tag"
    class="app-button"
    :class="[`app-button--${variant}`, `app-button--${size}`, { 'app-button--block': block }]"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    to?: RouteLocationRaw;
    href?: string;
    block?: boolean;
    /** Only applies when rendered as a native `<button>` (no `to`/`href`). */
    type?: 'button' | 'submit';
    disabled?: boolean;
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    to: undefined,
    href: undefined,
    block: false,
    type: 'button',
    disabled: false,
  },
);

const tag = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return 'a';
  return 'button';
});
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-button:hover {
  text-decoration: none;
}

.app-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.app-button--block {
  width: 100%;
}

.app-button--sm {
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
}

.app-button--md {
  padding: 0.6rem 1.3rem;
  font-size: 0.87rem;
}

.app-button--lg {
  padding: 1.6rem 1.3rem;
  font-size: 0.87rem;
  border-radius: var(--radius-md);
  transition-duration: 0.25s;
}

.app-button--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  box-shadow: 0 8px 20px -6px rgba(var(--color-primary-rgb), 0.5);
}

.app-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px -6px rgba(var(--color-primary-rgb), 0.6);
}

.app-button--primary:active {
  transform: translateY(0);
}

.app-button--lg.app-button--primary {
  box-shadow: 0 8px 10px -6px rgba(var(--color-primary-rgb), 0.5);
}

.app-button--lg.app-button--primary:hover {
  box-shadow: 0 10px 12px -6px rgba(var(--color-primary-rgb), 0.6);
}

.app-button--ghost {
  background: rgba(var(--overlay-rgb), 0.05);
  color: var(--color-secondary);
}

.app-button--ghost:hover {
  background: rgba(var(--overlay-rgb), 0.09);
}
</style>
