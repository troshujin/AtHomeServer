<template>
  <div class="page-shell" :style="{ maxWidth }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/**
 * The centered, capped-width column every page's content lives in - one
 * place for the app's page padding and vertical rhythm instead of each
 * view re-declaring it. `maxWidth` is the only knob pages differ on
 * (720px forms/lists, 1000px detail, 1200px dashboard grids).
 */
withDefaults(
  defineProps<{
    maxWidth?: string;
  }>(),
  {
    maxWidth: '720px',
  },
);
</script>

<style scoped>
.page-shell {
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
