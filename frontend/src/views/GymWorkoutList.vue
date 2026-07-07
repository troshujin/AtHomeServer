<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <PageHeader title="My lifts" subtitle="Open workouts first, then everything you've finished." />

    <AppButton variant="primary" size="lg" block to="/gym/workouts/new">
      New workout
    </AppButton>

    <SectionCard v-if="openLoading || openItems.length > 0" title="In progress">
      <WorkoutFeed :items="openItems" :loading="openLoading" empty-message="No open workouts." />
    </SectionCard>

    <SectionCard title="Finished">
      <WorkoutFeed
        :items="finishedItems"
        :loading="finishedLoading"
        empty-message="You haven't finished a workout yet."
      />
      <Pager
        v-if="finishedTotalPages > 1"
        :page="finishedPage"
        :total-pages="finishedTotalPages"
        @update:page="loadFinishedPage"
      />
    </SectionCard>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import Pager from '@/components/common/Pager.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed, { type WorkoutFeedItem } from '@/components/gym/WorkoutFeed.vue';
import useWorkouts from '@/composables/gym/useWorkout';

const FINISHED_PAGE_SIZE = 10;

// Two independent instances - each keeps its own `data`/`loading` refs, so
// "in progress" and "finished page N" can be shown at once without one
// execute() call clobbering the other's view of the shared key/value cache.
const { fetchWorkouts: fetchOpenWorkouts } = useWorkouts();
const { fetchWorkouts: fetchFinishedWorkouts } = useWorkouts();

const openLoading = fetchOpenWorkouts.loading;
const finishedLoading = fetchFinishedWorkouts.loading;

// Filtering and ordering both happen server-side now.
const openItems = computed<WorkoutFeedItem[]>(() =>
  (fetchOpenWorkouts.data.value?.items ?? []).map((workout) => ({ workout })),
);

const finishedItems = computed<WorkoutFeedItem[]>(() =>
  (fetchFinishedWorkouts.data.value?.items ?? []).map((workout) => ({ workout })),
);

const finishedPage = ref(1);
const finishedTotalPages = computed(() =>
  Math.max(1, Math.ceil((fetchFinishedWorkouts.data.value?.total ?? 0) / FINISHED_PAGE_SIZE)),
);

const loadFinishedPage = (page: number) => {
  finishedPage.value = page;
  fetchFinishedWorkouts.execute({
    finished: true,
    skip: (page - 1) * FINISHED_PAGE_SIZE,
    limit: FINISHED_PAGE_SIZE,
  });
};

onMounted(() => {
  // No pager for "in progress" - realistically 0-1 items, a generous limit
  // is simpler than a control nobody needs.
  fetchOpenWorkouts.execute({ finished: false, limit: 50 });
  loadFinishedPage(1);
});
</script>
