<template>
  <div class="empty-state">
    <p class="empty-state__message">{{ message }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem 0.25rem;
}

.empty-state__message {
  margin: 0;
  color: var(--color-text);
  opacity: 0.65;
  font-size: 0.9rem;
}
</style>
