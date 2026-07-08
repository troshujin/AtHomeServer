<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <PageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <SectionCard :title="copy.sectionTitle">
      <WorkoutFeed :workouts="workouts" :loading="loading" :empty-message="copy.emptyMessage" />
    </SectionCard>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import BackLink from '@/components/common/BackLink.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed from '@/components/gym/WorkoutFeed.vue';
import useFriends from '@/composables/gym/useFriends';
import usePromoted from '@/composables/gym/usePromoted';
import type { Workout } from '@/types/gym';

const props = defineProps<{
  feed: 'friends' | 'promoted';
}>();

const COPY = {
  friends: {
    title: 'Friends',
    subtitle: 'Everything your friends have been lifting, newest first.',
    sectionTitle: 'Friend activity',
    emptyMessage: 'No friend activity yet.',
  },
  promoted: {
    title: 'Promoted',
    subtitle: 'Standout workouts from around the community.',
    sectionTitle: 'Community workouts',
    emptyMessage: 'Nothing promoted right now.',
  },
} as const;

const copy = computed(() => COPY[props.feed]);

const { data, loading, execute } =
  props.feed === 'friends' ? useFriends().fetchFriendActivity : usePromoted().fetchPromotedActivity;

const workouts = computed<Workout[]>(() => data.value?.items ?? []);

onMounted(() => execute());
</script>
