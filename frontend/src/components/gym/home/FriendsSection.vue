<template>
  <SectionCard title="Friends">
    <template #actions>
      <AppButton size="sm">Manage friends</AppButton>
      <AppButton size="sm" to="/gym/friends">View All</AppButton>
    </template>

    <WorkoutFeed
      :workouts="workouts"
      :loading="loading"
      empty-message="No friend activity yet."
      more-to="/gym/friends"
    />
  </SectionCard>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed from '@/components/gym/WorkoutFeed.vue';
import useFriends from '@/composables/gym/useFriends';
import type { Workout } from '@/types/gym';

const { fetchFriendActivity } = useFriends();
const { data, loading, execute } = fetchFriendActivity;

const workouts = computed<Workout[]>(() => data.value?.items ?? []);

onMounted(() => execute());
</script>
