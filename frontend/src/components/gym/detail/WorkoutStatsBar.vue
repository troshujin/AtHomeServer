<template>
  <div class="workout-stats">
    <div class="workout-stats__hero">
      <span class="workout-stats__hero-value">{{ formattedVolume }}</span>
      <span class="workout-stats__hero-label">kg total volume</span>
    </div>

    <dl class="workout-stats__grid">
      <div class="workout-stats__item">
        <dt>Duration</dt>
        <dd>{{ duration }}</dd>
      </div>
      <div class="workout-stats__item">
        <dt>Exercises</dt>
        <dd>{{ workout.exercises.length }}</dd>
      </div>
      <div class="workout-stats__item">
        <dt>Sets</dt>
        <dd>{{ totalSets }}</dd>
      </div>
      <div class="workout-stats__item">
        <dt>Reps</dt>
        <dd>{{ totalReps }}</dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useWorkoutUtils } from '@/composables/gym/utils/useWorkoutUtils';
import { formatDuration } from '@/lib/formatters';
import type { Workout } from '@/types/gym';

const props = defineProps<{
  workout: Workout;
}>();

const workoutUtils = useWorkoutUtils(props.workout);

const formattedVolume = computed(() => new Intl.NumberFormat('nl-NL').format(workoutUtils.getVolume()));

const duration = computed(() => formatDuration(props.workout.startedAt, props.workout.endedAt));

const totalSets = computed(() =>
  props.workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
);

const totalReps = computed(() =>
  props.workout.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.reduce((setSum, set) => setSum + set.reps.reduce((r, rep) => r + rep.amount, 0), 0),
    0,
  ),
);
</script>

<style scoped>
.workout-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--surface-shadow);
}

.workout-stats__hero {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.workout-stats__hero-value {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  line-height: 1;
}

.workout-stats__hero-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

.workout-stats__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2rem;
  margin: 0;
  padding-left: 1.5rem;
  border-left: 1px solid var(--surface-border);
}

.workout-stats__item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.workout-stats__item dt {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.65;
}

.workout-stats__item dd {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-secondary);
}

@media (max-width: 480px) {
  .workout-stats__grid {
    padding-left: 0;
    border-left: none;
    gap: 1rem 1.5rem;
  }
}
</style>
