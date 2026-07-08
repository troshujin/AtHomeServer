<template>
  <SectionCard title="My latest lifts">
    <template #actions>
      <AppButton size="sm" to="/gym/workouts">View all</AppButton>
    </template>

    <WorkoutFeed
      :workouts="workouts"
      :loading="loading"
      empty-message="You haven't logged a workout yet."
      more-to="/gym/workouts"
    />

    <AppButton
      class="my-lifts-section__add"
      variant="primary"
      size="lg"
      block
      to="/gym/workouts/new"
    >
      New workout
    </AppButton>
  </SectionCard>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed from '@/components/gym/WorkoutFeed.vue';
import useWorkouts from '@/composables/gym/useWorkout';
import type { Workout } from '@/types/gym';

const PREVIEW_SIZE = 5;

const { fetchWorkouts } = useWorkouts();
const { data, loading, execute } = fetchWorkouts;

const workouts = computed<Workout[]>(() => data.value?.items ?? []);

onMounted(() => execute({ limit: PREVIEW_SIZE }));
</script>

<style scoped>
.my-lifts-section__add {
  margin-top: 0.5rem;
}
</style>
