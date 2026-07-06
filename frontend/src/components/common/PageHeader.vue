<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script lang="ts" setup>
/** Page title + optional one-line subtitle, the same on every list page. */
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.page-header__title {
  margin: 0;
  font-size: 1.75rem;
}

.page-header__subtitle {
  margin: 0;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
