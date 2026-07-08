<template>
  <SectionCard title="Promoted">
    <template #actions>
      <AppButton size="sm" to="/gym/promoted">View all</AppButton>
    </template>

    <WorkoutFeed
      :workouts="workouts"
      :loading="loading"
      empty-message="Nothing promoted right now."
      more-to="/gym/promoted"
    />
  </SectionCard>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed from '@/components/gym/WorkoutFeed.vue';
import usePromoted from '@/composables/gym/usePromoted';
import type { Workout } from '@/types/gym';

const { fetchPromotedActivity } = usePromoted();
const { data, loading, execute } = fetchPromotedActivity;

const workouts = computed<Workout[]>(() => data.value?.items ?? []);

onMounted(() => execute());
</script>
