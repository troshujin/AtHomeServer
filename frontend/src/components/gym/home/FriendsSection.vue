<template>
  <SectionCard title="Friends">
    <template #actions>
      <AppButton size="sm">Manage friends</AppButton>
      <AppButton size="sm" to="/gym/friends">View All</AppButton>
    </template>

    <WorkoutFeed
      :items="items"
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
import WorkoutFeed, { type WorkoutFeedItem } from '@/components/gym/WorkoutFeed.vue';
import useFriends from '@/composables/gym/useFriends';

const { fetchFriendActivity } = useFriends();
const { data, loading, execute } = fetchFriendActivity;

const items = computed<WorkoutFeedItem[]>(() => data.value ?? []);

onMounted(() => execute());
</script>
