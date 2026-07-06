<template>
  <span class="badge-pill" :class="`badge-pill--${variant}`">
    <slot />
  </span>
</template>

<script lang="ts" setup>
/**
 * Small uppercase status/label pill ("You", "In progress"). Two tints so
 * two badges can sit side by side and still read as different kinds of
 * information: `primary` for identity/ownership, `accent` for live state.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'accent';
  }>(),
  {
    variant: 'primary',
  },
);
</script>

<style scoped>
.badge-pill {
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.badge-pill--primary {
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
}

.badge-pill--accent {
  background: rgba(var(--color-accent-rgb), 0.12);
  color: var(--color-accent);
}
</style>
