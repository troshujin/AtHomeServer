<template>
  <PageShell>
    <BackLink to="/gym">Back to Gym</BackLink>

    <PageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <SectionCard :title="copy.sectionTitle">
      <WorkoutFeed :items="items" :loading="loading" :empty-message="copy.emptyMessage" />
    </SectionCard>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import BackLink from '@/components/common/BackLink.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import WorkoutFeed, { type WorkoutFeedItem } from '@/components/gym/WorkoutFeed.vue';
import useFriends from '@/composables/gym/useFriends';
import usePromoted from '@/composables/gym/usePromoted';

/**
 * One view for both `/gym/friends` and `/gym/promoted` - the two pages are
 * the same shape (a full-length activity feed) with different data and
 * copy, so they share a component the way create/edit share the workout
 * form. The `feed` prop is static per route, so choosing the composable
 * once at setup is safe.
 */
const props = defineProps<{
  feed: 'friends' | 'promoted';
}>();

const COPY = {
  friends: {
    title: 'Friends',
    subtitle: "Everything your friends have been lifting, newest first.",
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
  props.feed === 'friends'
    ? useFriends().fetchFriendActivity
    : usePromoted().fetchPromotedActivity;

// `data` is a union (Paginated<GymActivityEntry> for friends, still mock;
// Paginated<Workout> for promoted, real) since which composable backs it
// is chosen once above - normalize per item via the one property only the
// former has, rather than branching on `props.feed` a second time here.
const items = computed<WorkoutFeedItem[]>(() =>
  (data.value?.items ?? []).map((entry) => ('workout' in entry ? entry : { workout: entry, user: entry.user })),
);

onMounted(() => execute());
</script>
