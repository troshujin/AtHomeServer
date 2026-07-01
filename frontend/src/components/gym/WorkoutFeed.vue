<template>
  <ul v-if="items.length > 0" class="workout-feed">
    <li v-for="item in items" :key="item.workout.id">
      <WorkoutCard :workout="item.workout" :user="item.user" />
    </li>
  </ul>

  <ul v-else-if="loading" class="workout-feed workout-feed--loading" aria-hidden="true">
    <li v-for="n in skeletonRows" :key="n" class="workout-feed__skeleton" />
  </ul>

  <EmptyState v-else :message="emptyMessage">
    <slot name="empty-action" />
  </EmptyState>
</template>

<script lang="ts" setup>
import EmptyState from '@/components/common/EmptyState.vue';
import WorkoutCard from '@/components/gym/WorkoutCard.vue';
import type { Workout } from '@/types/gym';
import type { User } from '@/types/user';

export interface WorkoutFeedItem {
  workout: Workout;
  user?: User;
}

withDefaults(
  defineProps<{
    items: WorkoutFeedItem[];
    loading?: boolean;
    emptyMessage?: string;
    skeletonRows?: number;
  }>(),
  {
    loading: false,
    emptyMessage: 'Nothing to show yet.',
    skeletonRows: 3,
  },
);
</script>

<style scoped>
.workout-feed {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.workout-feed__skeleton {
  height: 3.1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.04) 25%,
    rgba(15, 23, 42, 0.08) 37%,
    rgba(15, 23, 42, 0.04) 63%
  );
  background-size: 400% 100%;
  animation: workout-feed-shimmer 1.4s ease infinite;
}

@keyframes workout-feed-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workout-feed__skeleton {
    animation: none;
  }
}
</style>
