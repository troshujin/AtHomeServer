<template>
  <ul v-if="items.length > 0" class="workout-feed">
    <li v-for="item in items" :key="item.workout.id" class="workout-feed__item">
      <WorkoutCard :workout="item.workout" :user="item.user" />
    </li>
    <li v-if="moreTo" class="workout-feed__item workout-feed__item--more">
      <FeedMoreCard :to="moreTo" :label="moreLabel" />
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
import type { RouteLocationRaw } from 'vue-router';
import EmptyState from '@/components/common/EmptyState.vue';
import FeedMoreCard from '@/components/gym/FeedMoreCard.vue';
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
    /** Destination for the trailing "view all" card, e.g. once the carousel runs out of items. */
    moreTo?: RouteLocationRaw;
    moreLabel?: string;
  }>(),
  {
    loading: false,
    emptyMessage: 'Nothing to show yet.',
    skeletonRows: 3,
    moreTo: undefined,
    moreLabel: 'View all',
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
  min-width: 0;
}

.workout-feed__skeleton {
  height: 3.1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(
    90deg,
    rgba(var(--overlay-rgb), 0.04) 25%,
    rgba(var(--overlay-rgb), 0.08) 37%,
    rgba(var(--overlay-rgb), 0.04) 63%
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

/*
 * Manual swipe carousel on small screens: one square-ish card at a time, with
 * the next one peeking in from the edge to hint that it's swipeable. It's a
 * plain horizontal scroller with scroll-snap - no gesture JS needed, so it
 * gets native momentum + snapping on touch devices for free. Finite by
 * construction: it only ever renders `items.length` cards plus the trailing
 * "view all" card, never loops.
 */
@media (max-width: 640px) {
  .workout-feed {
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 0.75rem;
    margin: 0 -1rem;
    padding: 0.1rem 1rem 0.5rem;
    scrollbar-width: none;
  }

  .workout-feed::-webkit-scrollbar {
    display: none;
  }

  .workout-feed__item {
    flex: 0 0 76%;
    max-width: 76%;
    aspect-ratio: 4 / 5;
    scroll-snap-align: start;
    /* Without this, a fast trackpad/mouse-wheel swipe can carry momentum
       straight past the next snap point and land two or three cards later.
       `always` forces the scroll to stop at every card before continuing. */
    scroll-snap-stop: always;
  }

  .workout-feed__item--more {
    flex: 0 0 45%;
    max-width: 45%;
  }
}
</style>
