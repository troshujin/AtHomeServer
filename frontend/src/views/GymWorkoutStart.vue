<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <PageHeader title="Start a workout" subtitle="Pick up where you left off, or start fresh." />

    <SectionCard title="In progress">
      <div v-if="loading && openWorkouts.length === 0" class="workout-start__skeleton" aria-hidden="true">
        <SkeletonBlock height="3.4rem" />
        <SkeletonBlock height="3.4rem" />
      </div>

      <EmptyState v-else-if="openWorkouts.length === 0" message="No open workouts — start a new one below." />

      <!-- Rows link straight to the edit page: this screen exists to get
           back to lifting, not to review results (that's the detail page,
           reachable via My lifts). -->
      <ul v-else class="workout-start__list">
        <li v-for="workout in openWorkouts" :key="workout.id">
          <RouterLink class="workout-start__row" :to="`/gym/workouts/${workout.id}/edit`">
            <div class="workout-start__row-text">
              <span class="workout-start__row-name">{{ workout.name }}</span>
              <span class="workout-start__row-meta">
                <span class="workout-start__row-status">In progress</span>
                &middot; started {{ formatDateShort(workout.startedAt) }}
              </span>
            </div>
            <span class="workout-start__row-resume">Resume &rarr;</span>
          </RouterLink>
        </li>
      </ul>
    </SectionCard>

    <AppButton variant="primary" size="lg" block :disabled="starting" @click="startWorkout">
      {{ starting ? 'Starting…' : '+ Start new workout' }}
    </AppButton>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import useStartWorkout from '@/composables/gym/useStartWorkout';
import useWorkouts from '@/composables/gym/useWorkout';
import { byMostRecent } from '@/composables/gym/utils/useWorkoutUtils';
import { formatDateShort } from '@/lib/formatters';

const { fetchWorkouts } = useWorkouts();
const { data, loading, execute } = fetchWorkouts;
const { startWorkout, starting } = useStartWorkout();

const openWorkouts = computed(() =>
  (data.value ?? []).filter((workout) => !workout.endedAt).sort(byMostRecent),
);

onMounted(() => execute());
</script>

<style scoped>
.workout-start__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.workout-start__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.workout-start__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3.4rem;
  padding: 0.65rem 0.9rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.workout-start__row:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  text-decoration: none;
}

.workout-start__row-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.workout-start__row-name {
  font-weight: 700;
  color: var(--color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workout-start__row-meta {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.workout-start__row-status {
  color: var(--color-primary);
  font-weight: 700;
}

.workout-start__row-resume {
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .workout-start__row {
    transition: none;
  }
}
</style>
