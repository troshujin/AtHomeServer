<template>
  <article class="workout-card">
    <RouterLink v-if="user" class="workout-card__avatar" :to="`/gym/users/${user.id}`">
      {{ initials }}
    </RouterLink>

    <div class="workout-card__body">
      <div class="workout-card__heading">
        <RouterLink v-if="user" class="workout-card__user" :to="`/gym/users/${user.id}`">
          {{ user.username }}
        </RouterLink>
        <RouterLink class="workout-card__name" :to="`/gym/workouts/${workout.id}`">
          {{ workout.name }}
        </RouterLink>
      </div>

      <div class="workout-card__meta">
        <span class="workout-card__volume">{{ formattedVolume }} kg lifted</span>
        <span class="workout-card__dot" aria-hidden="true">&middot;</span>
        <span class="workout-card__date">{{ formatDateShort(workout.startedAt) }}</span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useWorkoutUtils } from '@/composables/gym/utils/useWorkoutUtils';
import { formatDateShort } from '@/lib/formatters';
import type { Workout } from '@/types/gym';
import type { User } from '@/types/user';

const props = defineProps<{
  workout: Workout;
  user?: User;
}>();

const workoutUtils = useWorkoutUtils(props.workout);

const formattedVolume = computed(() => new Intl.NumberFormat('nl-NL').format(workoutUtils.getVolume()));

const initials = computed(() => (props.user?.username.slice(0, 2).toUpperCase() ?? ''));
</script>

<style scoped>
.workout-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  transition: background-color 0.15s ease;
}

.workout-card:hover {
  background: rgba(15, 23, 42, 0.035);
}

.workout-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.workout-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.workout-card__heading {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.workout-card__user {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-secondary);
  text-decoration: none;
}

.workout-card__user:hover {
  color: var(--color-primary);
}

.workout-card__name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-primary);
  text-decoration: none;
}

.workout-card__name:hover {
  text-decoration: underline;
}

.workout-card__meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}
</style>
