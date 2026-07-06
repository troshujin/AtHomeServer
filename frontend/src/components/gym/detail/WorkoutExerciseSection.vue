<template>
  <section :id="anchorId" class="exercise-section">
    <header class="exercise-section__header">
      <h2 class="exercise-section__name">{{ exercise.name }}</h2>
      <span class="exercise-section__time">{{ formatTimeRange(exercise.startedAt, exercise.endedAt) }}</span>
    </header>

    <ol class="exercise-section__sets">
      <li v-for="(set, index) in exercise.sets" :key="set.id" class="exercise-set">
        <span class="exercise-set__index">{{ index + 1 }}</span>
        <RepChart :reps="set.reps" />
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { formatTimeRange } from '@/lib/formatters';
import type { WorkoutExercise } from '@/types/gym';
import { exerciseAnchorId } from './anchors';
import RepChart from './RepChart.vue';

const props = defineProps<{
  exercise: WorkoutExercise;
}>();

const anchorId = computed(() => exerciseAnchorId(props.exercise.id));
</script>

<style scoped>
.exercise-section {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--surface-shadow);
  /* Room so the sticky header doesn't cover the heading when a quick-nav
     link jumps here. */
  scroll-margin-top: 5.5rem;
}

.exercise-section__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.exercise-section__name {
  margin: 0;
  font-size: 1.1rem;
}

.exercise-section__time {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

.exercise-section__sets {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.exercise-set {
  display: flex;
  /* RepChart is a single fixed-height row (it scrolls instead of wrapping),
     so the index badge can just center against it. */
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
}

.exercise-set__index {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
