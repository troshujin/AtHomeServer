<template>
  <li class="friend-row">
    <UserBadge :user="user" :to="`/users/${user.id}`" />
    <div class="friend-row__actions">
      <slot />
    </div>
  </li>
</template>

<script lang="ts" setup>
import UserBadge from '@/components/common/UserBadge.vue';
import type { User } from '@/types/user';

/**
 * One person in a friends/requests/blocked list: the badge links to their
 * profile card page (`/users/:id` - "view profile" is the row itself, not a
 * button), and the slot holds that list's row actions (Accept / Ignore /
 * Unfriend / ...).
 */
defineProps<{
  user: User;
}>();
</script>

<style scoped>
.friend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.65rem 0.25rem;
  border-radius: var(--radius-md);
  transition: background-color 0.15s ease;
}

.friend-row:hover {
  background: rgba(var(--overlay-rgb), 0.035);
}

.friend-row__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  /* When the actions wrap under the name on a narrow phone, keep them
     aligned with the badge text rather than dangling at the far edge. */
  margin-left: auto;
}

@media (prefers-reduced-motion: reduce) {
  .friend-row {
    transition: none !important;
  }
}
</style>
