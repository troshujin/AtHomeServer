<template>
  <RouterLink class="feed-more" :to="to">
    <span class="feed-more__icon" aria-hidden="true">&rarr;</span>
    <span class="feed-more__label">{{ label }}</span>
  </RouterLink>
</template>

<script lang="ts" setup>
import { RouterLink, type RouteLocationRaw } from 'vue-router';

withDefaults(
  defineProps<{
    to: RouteLocationRaw;
    label?: string;
  }>(),
  {
    label: 'View all',
  },
);
</script>

<style scoped>
.feed-more {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.feed-more:hover {
  background: rgba(var(--overlay-rgb), 0.035);
  text-decoration: none;
}

.feed-more__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb), 0.12);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .feed-more {
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 0.6rem;
    border-radius: var(--radius-lg);
    border: 1.5px dashed rgba(var(--color-primary-rgb), 0.35);
    background: rgba(var(--color-primary-rgb), 0.05);
  }

  .feed-more__icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.1rem;
  }

  .feed-more__label {
    font-size: 0.95rem;
    text-align: center;
  }
}
</style>
