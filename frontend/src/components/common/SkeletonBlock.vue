<template>
  <div class="skeleton-block" :style="{ height, width, borderRadius }" />
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    height?: string;
    width?: string;
    borderRadius?: string;
  }>(),
  {
    height: '1rem',
    width: '100%',
    borderRadius: 'var(--radius-md)',
  },
);
</script>

<style scoped>
.skeleton-block {
  background: linear-gradient(
    90deg,
    rgba(var(--overlay-rgb), 0.04) 25%,
    rgba(var(--overlay-rgb), 0.08) 37%,
    rgba(var(--overlay-rgb), 0.04) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-block-shimmer 1.4s ease infinite;
}

@keyframes skeleton-block-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block {
    animation: none;
  }
}
</style>
