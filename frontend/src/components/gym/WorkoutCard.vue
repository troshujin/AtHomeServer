<template>
  <main>
    <RouterLink :to="`/gym/users/${user.id}`">{{ user.username }}</RouterLink>
    <span> - </span>
    <RouterLink :to="`/gym/workouts/${workout.id}`">{{ workoutUtils.getVolume() }}</RouterLink>
    <span> - </span>
    <RouterLink :to="`/gym/workouts/${workout.id}`">{{ formatDateShort(workout.startedAt) }}</RouterLink>
  </main>
</template>

<script lang="ts" setup>
import { useWorkout } from '@/composables/gym/workout';
import { formatDateShort } from '@/lib/formatters';
import type { Workout } from '@/types/gym';
import type { User } from '@/types/user';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  user: User;
  workout: Workout;
}>();

const workoutUtils = useWorkout(props.workout);
</script>
