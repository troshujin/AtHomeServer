<template>
  <SectionCard title="My latest lifts">
    <template #actions>
      <AppButton size="sm" to="/gym/workouts">View all</AppButton>
    </template>

    <WorkoutFeed :items="items" :loading="loading" empty-message="You haven't logged a workout yet." />

    <AppButton class="my-lifts-section__add" variant="primary" size="lg" block to="/gym/workouts/new">
      + Add workout
    </AppButton>
  </SectionCard>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed, { type WorkoutFeedItem } from '@/components/gym/WorkoutFeed.vue';
import useWorkouts from '@/composables/gym/useWorkout';

const { fetchWorkouts } = useWorkouts();
const { data, loading, execute } = fetchWorkouts;

const items = computed<WorkoutFeedItem[]>(() => (data.value ?? []).map((workout) => ({ workout })));

onMounted(() => execute());
</script>

<style scoped>
.my-lifts-section__add {
  margin-top: 0.5rem;
}
</style>
