<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <PageHeader title="My lifts" subtitle="Open workouts first, then everything you've finished." />

    <AppButton variant="primary" size="lg" block to="/gym/workouts/new">
      New workout
    </AppButton>

    <SectionCard v-if="loading || openItems.length > 0" title="In progress">
      <WorkoutFeed :items="openItems" :loading="loading" empty-message="No open workouts." />
    </SectionCard>

    <SectionCard title="Finished">
      <WorkoutFeed
        :items="finishedItems"
        :loading="loading"
        empty-message="You haven't finished a workout yet."
      />
    </SectionCard>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed, { type WorkoutFeedItem } from '@/components/gym/WorkoutFeed.vue';
import useWorkouts from '@/composables/gym/useWorkout';
import { byMostRecent } from '@/composables/gym/utils/useWorkoutUtils';

const { fetchWorkouts } = useWorkouts();
const { data, loading, execute } = fetchWorkouts;

const sorted = computed(() => [...(data.value ?? [])].sort(byMostRecent));

const openItems = computed<WorkoutFeedItem[]>(() =>
  sorted.value.filter((workout) => !workout.endedAt).map((workout) => ({ workout })),
);

const finishedItems = computed<WorkoutFeedItem[]>(() =>
  sorted.value.filter((workout) => workout.endedAt).map((workout) => ({ workout })),
);

onMounted(() => execute());
</script>
