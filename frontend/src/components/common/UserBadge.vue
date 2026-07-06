<template>
  <RouterLink class="user-badge" :class="`user-badge--${size}`" :to="`/gym/users/${user.id}`">
    <span class="user-badge__avatar" aria-hidden="true">{{ initials }}</span>
    <span class="user-badge__name">{{ user.username }}</span>
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { User } from '@/types/user';

const props = withDefaults(
  defineProps<{
    user: User;
    size?: 'sm' | 'md';
  }>(),
  {
    size: 'md',
  },
);

const initials = computed(() => props.user.username.slice(0, 2).toUpperCase());
</script>

<style scoped>
.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--color-secondary);
  text-decoration: none;
  font-weight: 700;
}

.user-badge:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.user-badge__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: #fff;
  font-weight: 700;
}

.user-badge--md .user-badge__avatar {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 0.8rem;
}

.user-badge--md .user-badge__name {
  font-size: 0.95rem;
}

.user-badge--sm .user-badge__avatar {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.65rem;
}

.user-badge--sm .user-badge__name {
  font-size: 0.85rem;
}
</style>
