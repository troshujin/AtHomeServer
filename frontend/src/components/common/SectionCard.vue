<template>
  <section class="section-card">
    <header class="section-card__header">
      <h2 class="section-card__title">{{ title }}</h2>
      <div v-if="$slots.actions" class="section-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="section-card__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped>
.section-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--surface-shadow);
  transition: background-color 0.2s ease, border-color 0.2s ease;
  /* Prevents a horizontally-scrolling descendant (the mobile carousel) from
     forcing this grid/flex item to grow to fit its full unscrolled width. */
  min-width: 0;
}

.section-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.section-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.section-card__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
</style>
