<template>
  <nav class="exercise-nav" aria-label="Jump to exercise">
    <p class="exercise-nav__title">Exercises</p>
    <ul class="exercise-nav__list">
      <li v-for="exercise in exercises" :key="exercise.id">
        <a class="exercise-nav__link" :href="`#${exerciseAnchorId(exercise.id)}`">{{ exercise.name }}</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import type { WorkoutExercise } from '@/types/gym';
import { exerciseAnchorId } from './anchors';

defineProps<{
  exercises: WorkoutExercise[];
}>();
</script>

<style scoped>
/* Desktop: a sticky sidebar next to the exercise list. */
.exercise-nav {
  position: sticky;
  top: 5.5rem;
  align-self: start;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--surface-shadow);
}

.exercise-nav__title {
  margin: 0 0 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text);
  opacity: 0.6;
}

.exercise-nav__list {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.exercise-nav__link {
  display: block;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-md);
  font-size: 0.87rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.exercise-nav__link:hover {
  background: rgba(var(--overlay-rgb), 0.06);
  color: var(--color-primary);
  text-decoration: none;
}

/* Mobile: a horizontal chip scroller instead of a sidebar - there's no
   room for a persistent column next to a single-column content flow. */
@media (max-width: 900px) {
  .exercise-nav {
    position: static;
    padding: 0.75rem 0 0.75rem 0.25rem;
    background: none;
    border: none;
    box-shadow: none;
    margin: 0 -1.25rem;
    padding-left: 1.25rem;
  }

  .exercise-nav__title {
    padding: 0 0 0.5rem 0.25rem;
  }

  .exercise-nav__list {
    flex-direction: row;
    gap: 0.5rem;
    overflow-x: auto;
    padding-right: 1.25rem;
    -webkit-overflow-scrolling: touch;
  }

  .exercise-nav__link {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-pill);
    background: var(--color-surface-alt);
    white-space: nowrap;
  }

  .exercise-nav__link:hover {
    background: rgba(var(--color-primary-rgb), 0.1);
  }
}
</style>
