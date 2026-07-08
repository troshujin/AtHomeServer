<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <div v-if="loading && !profile" class="user-profile__skeleton" aria-hidden="true">
      <SkeletonBlock height="4.5rem" width="60%" />
      <SkeletonBlock height="1.1rem" width="40%" />
      <SkeletonBlock height="14rem" />
    </div>

    <EmptyState v-else-if="!profile" message="This user doesn't exist, or isn't visible to you.">
      <AppButton variant="primary" to="/gym">Back to Gym</AppButton>
    </EmptyState>

    <template v-else>
      <header class="user-profile__header">
        <span class="user-profile__avatar" aria-hidden="true">{{ initials }}</span>
        <div class="user-profile__heading">
          <h1 class="user-profile__name">
            {{ profile.user.username }}
            <BadgePill v-if="profile.isMe">You</BadgePill>
          </h1>
          <p class="user-profile__meta">
            <strong>{{ profile.workouts.length }}</strong>
            {{ profile.workouts.length === 1 ? 'workout' : 'workouts' }}
            <span class="user-profile__dot" aria-hidden="true">&middot;</span>
            <strong>{{ formatKg(totalVolume) }}</strong> kg lifted in total
          </p>
        </div>
      </header>

      <AppButton v-if="profile.isMe" variant="primary" size="lg" block to="/gym/workouts/new">
        New workout
      </AppButton>

      <SectionCard title="Workouts">
        <WorkoutFeed
          :workouts="workouts"
          :empty-message="
            profile.isMe ? 'You haven\'t logged a workout yet.' : 'No workouts to show yet.'
          "
        />
      </SectionCard>
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
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import WorkoutFeed from '@/components/gym/WorkoutFeed.vue';
import useUserProfile from '@/composables/gym/useUserProfile';
import { useWorkoutUtils } from '@/composables/gym/utils/useWorkoutUtils';
import { formatKg } from '@/lib/formatters';
import type { Workout } from '@/types/gym';

const props = defineProps<{
  id: string;
}>();

const { fetchUserProfile } = useUserProfile();
const { data: profile, loading, execute } = fetchUserProfile;

const initials = computed(() => (profile.value?.user.username ?? '').slice(0, 2).toUpperCase());

const totalVolume = computed(() =>
  (profile.value?.workouts ?? []).reduce(
    (sum, workout) => sum + useWorkoutUtils(workout).getVolume(),
    0,
  ),
);

const workouts = computed<Workout[]>(() => profile.value?.workouts ?? []);

onMounted(() => execute(props.id));

watch(
  () => props.id,
  (id) => execute(id),
);
</script>

<style scoped>
.user-profile__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-profile__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
}

.user-profile__heading {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.user-profile__name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  font-size: 1.6rem;
}

.user-profile__meta {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.75;
}

.user-profile__meta strong {
  color: var(--color-secondary);
  font-weight: 700;
}

.user-profile__dot {
  margin: 0 0.35rem;
  opacity: 0.5;
}
</style>
