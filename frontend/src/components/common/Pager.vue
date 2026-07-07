<template>
  <nav class="pager" aria-label="Pagination">
    <AppButton variant="ghost" :disabled="page <= 1" @click="$emit('update:page', page - 1)">
      Previous
    </AppButton>
    <span class="pager__status">Page {{ page }} of {{ totalPages }}</span>
    <AppButton variant="ghost" :disabled="page >= totalPages" @click="$emit('update:page', page + 1)">
      Next
    </AppButton>
  </nav>
</template>

<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';

defineProps<{
  /** 1-indexed. */
  page: number;
  totalPages: number;
}>();

defineEmits<{
  'update:page': [page: number];
}>();
</script>

<style scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pager__status {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
  white-space: nowrap;
}
</style>
