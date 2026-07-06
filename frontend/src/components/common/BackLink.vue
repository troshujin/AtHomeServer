<template>
  <RouterLink class="back-link" :to="to">
    <span aria-hidden="true">&larr;</span> <slot>Back</slot>
  </RouterLink>
</template>

<script lang="ts" setup>
import { RouterLink, type RouteLocationRaw } from 'vue-router';

/** The "← Back to X" link at the top of every sub-page. */
defineProps<{
  to: RouteLocationRaw;
}>();
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  font-size: 0.87rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.75;
  text-decoration: none;
}

.back-link:hover {
  opacity: 1;
  color: var(--color-primary);
  text-decoration: none;
}
</style>
