<template>
  <PageShell class="workout-detail" max-width="1000px">
    <BackLink to="/gym">Back to Gym</BackLink>

    <div v-if="loading && !entry" class="workout-detail__skeleton" aria-hidden="true">
      <SkeletonBlock height="2.2rem" width="55%" />
      <SkeletonBlock height="1.3rem" width="35%" />
      <SkeletonBlock height="6.5rem" />
      <SkeletonBlock height="9rem" />
      <SkeletonBlock height="9rem" />
    </div>

    <EmptyState v-else-if="!entry" message="This workout doesn't exist, or isn't visible to you.">
      <AppButton variant="primary" to="/gym">Back to Gym</AppButton>
    </EmptyState>

    <template v-else>
      <header class="workout-detail__header">
        <div class="workout-detail__heading">
          <h1 class="workout-detail__title">{{ entry.workout.name }}</h1>
          <div class="workout-detail__byline">
            <UserBadge :user="entry.user" />
            <BadgePill v-if="isMine">You</BadgePill>
            <BadgePill v-if="!entry.workout.endedAt" variant="accent">In progress</BadgePill>
            <span class="workout-detail__dot" aria-hidden="true">&middot;</span>
            <span class="workout-detail__date">{{ formatDateShort(entry.workout.startedAt) }}</span>
          </div>
        </div>

        <AppButton v-if="isMine" :to="`/gym/workouts/${entry.workout.id}/edit`">Edit</AppButton>
      </header>

      <WorkoutStatsBar :workout="entry.workout" />

      <div class="workout-detail__layout">
        <WorkoutExerciseNav v-if="entry.workout.exercises.length > 1" :exercises="entry.workout.exercises" />

        <div class="workout-detail__exercises">
          <WorkoutExerciseSection
            v-for="exercise in entry.workout.exercises"
            :key="exercise.id"
            :exercise="exercise"
          />
        </div>
      </div>
    </template>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import BadgePill from '@/components/common/BadgePill.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import PageShell from '@/components/common/PageShell.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import UserBadge from '@/components/common/UserBadge.vue';
import WorkoutExerciseNav from '@/components/gym/detail/WorkoutExerciseNav.vue';
import WorkoutExerciseSection from '@/components/gym/detail/WorkoutExerciseSection.vue';
import WorkoutStatsBar from '@/components/gym/detail/WorkoutStatsBar.vue';
import useCurrentUser from '@/composables/auth/useCurrentUser';
import useWorkoutDetail from '@/composables/gym/useWorkoutDetail';
import { formatDateShort } from '@/lib/formatters';

const props = defineProps<{
  id: string;
}>();

const { fetchMe } = useCurrentUser();
const { fetchWorkoutDetail } = useWorkoutDetail();
const { data: entry, loading, execute } = fetchWorkoutDetail;

const isMine = computed(() => {
  const me = fetchMe.data.value;
  return !!me && entry.value?.user.id === me.id;
});

onMounted(() => {
  fetchMe.execute();
  execute(props.id);
});
watch(() => props.id, (id) => execute(id));
</script>

<style scoped>
.workout-detail__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.workout-detail__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.workout-detail__title {
  margin: 0;
  font-size: 1.75rem;
}

.workout-detail__byline {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.workout-detail__dot {
  color: var(--color-text);
  opacity: 0.4;
}

.workout-detail__date {
  font-size: 0.87rem;
  color: var(--color-text);
  opacity: 0.65;
}

.workout-detail__layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 1.25rem;
  align-items: start;
}

/*
 * WorkoutExerciseNav comes first in the template - a short jump-list before
 * the long content it points into reads better for a screen reader/no-CSS
 * fallback. Explicit grid-column placement (rather than `order`, which
 * doesn't change which column auto-placement assigns) puts it visually on
 * the right instead, next to the exercise list.
 */
.workout-detail__layout :deep(.exercise-nav) {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
}

.workout-detail__exercises {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  grid-column: 1;
  grid-row: 1;
  /* A `1fr` grid track is `minmax(auto, 1fr)` - without this, the track
     won't shrink below this item's content's natural width, and a
     horizontally-scrolling descendant (RepChart) has no bounded width to
     scroll within, so it just grows the whole page instead of scrolling
     internally. Same fix as WorkoutFeed's carousel, one level up in a grid
     instead of a flex chain - see the style guide's Theming-adjacent CSS
     notes for the general pattern. */
  min-width: 0;
}

@media (max-width: 900px) {
  .workout-detail__layout {
    grid-template-columns: 1fr;
  }

  /* Single column now - let both fall back to natural DOM order (nav's
     chips above the exercise list) instead of the explicit placement
     above, which would otherwise conjure a phantom second column. */
  .workout-detail__layout :deep(.exercise-nav),
  .workout-detail__exercises {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
