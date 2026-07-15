<template>
  <PageShell>
    <PageHeader
      title="Profile"
      subtitle="Your card is how you show up around the app — make it yours."
    />

    <div v-if="loading" class="profile__skeleton" aria-hidden="true">
      <SkeletonBlock height="13rem" border-radius="1.25rem" />
      <SkeletonBlock height="3rem" />
      <SkeletonBlock height="16rem" />
    </div>

    <EmptyState v-else-if="!me" message="We couldn't load your profile. Try again in a moment.">
      <AppButton variant="primary" to="/">Back to Home</AppButton>
    </EmptyState>

    <template v-else>
      <section class="profile__preview" aria-label="Profile card preview">
        <ProfileCard
          :user="displayUser"
          :member-since="me.createdOn"
          :stats="cardStats"
          empty-message="Pick stats below to show them off here."
        />
      </section>

      <p v-if="isPrivate" class="profile__privacy-note" role="status">
        <Icon icon="md.lock" />
        Your card is private — visitors see a hidden notice instead of your stats.
      </p>

      <div class="profile__actions">
        <AppButton variant="primary" :href="editProfileUrl" block>
          <Icon icon="md.pencil" />
          Edit profile details
        </AppButton>
        <AppButton variant="ghost" to="/friends" block>
          <Icon icon="md.person" />
          Manage friends
        </AppButton>
      </div>

      <SectionCard title="Card stats">
        <template #actions>
          <span class="profile__saving" role="status">
            {{ updateCardStats.loading.value ? 'Saving…' : '' }}
          </span>
        </template>

        <p class="profile__picker-hint">
          Pick up to {{ MAX_CARD_STATS }} stats to show on your card — the first one you pick
          becomes the headline. {{ selectedKeys.length }} of {{ MAX_CARD_STATS }} picked.
        </p>

        <EmptyState
          v-if="!availableStats.length"
          message="No stats to show yet — they'll appear once you start logging."
        >
          <AppButton variant="primary" to="/gym/workouts/new">Log your first workout</AppButton>
        </EmptyState>

        <div v-else class="profile__stat-grid">
          <StatPickerTile
            v-for="stat in availableStats"
            :key="stat.key"
            :stat-key="stat.key"
            :value="stat.value"
            :selected="selectedKeys.includes(stat.key)"
            :disabled="isCardFull && !selectedKeys.includes(stat.key)"
            @toggle="toggleStat(stat.key)"
          />
        </div>
      </SectionCard>

      <SectionCard title="Privacy">
        <ToggleRow
          :model-value="isPrivate"
          icon="md.lock"
          label="Private card"
          description="Hide your card from visitors — anyone opening your profile sees a hidden notice instead of your stats."
          :disabled="updateCardPrivacy.loading.value"
          @update:model-value="setPrivacy"
        />
      </SectionCard>
    </template>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Icon from '@/components/common/Icon.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import ToggleRow from '@/components/common/ToggleRow.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import StatPickerTile from '@/components/profile/StatPickerTile.vue';
import useCurrentUser, { toDisplayUser } from '@/composables/auth/useCurrentUser';
import useProfileStats from '@/composables/profile/useProfileStats';
import { API_BASE_URL } from '@/lib/config';
import { MAX_CARD_STATS } from '@/lib/profileStats';
import type { ProfileStat } from '@/types/profile';

const { fetchMe } = useCurrentUser();
const { fetchMyStats, fetchCardStats, updateCardStats, updateCardPrivacy } = useProfileStats();

const me = fetchMe.data;

const loading = computed(
  () =>
    (fetchMe.loading.value || fetchMyStats.loading.value || fetchCardStats.loading.value) &&
    !me.value,
);

const displayUser = computed(() => toDisplayUser(me.value!));

// Profile details live on the trojonetworks identity - the backend forwards
// this to the network's own edit page (a genuinely external navigation, so
// `href` rather than `to` - STYLE_GUIDE §11).
const editProfileUrl = `${API_BASE_URL}/me/edit`;

const availableStats = computed<ProfileStat[]>(() => fetchMyStats.data.value ?? []);

const statValues = computed(
  () => new Map(availableStats.value.map((stat) => [stat.key, stat.value])),
);

/**
 * The pinned selection, edited optimistically: toggling updates this list
 * (and therefore the card preview) immediately, then persists. On a failed
 * save it rolls back to the server's copy - the API client's global error
 * toast covers telling the user.
 */
const selectedKeys = ref<string[]>([]);

/** Card privacy, edited with the same optimistic-then-rollback shape. */
const isPrivate = ref(false);

watch(
  () => fetchCardStats.data.value,
  (cardStatsData) => {
    if (cardStatsData) {
      selectedKeys.value = [...cardStatsData.statKeys];
      isPrivate.value = cardStatsData.isPrivate;
    }
  },
  { immediate: true },
);

const setPrivacy = async (next: boolean) => {
  const previous = isPrivate.value;
  isPrivate.value = next;

  try {
    await updateCardPrivacy.execute(next);
  } catch {
    isPrivate.value = previous;
  }
};

const isCardFull = computed(() => selectedKeys.value.length >= MAX_CARD_STATS);

const cardStats = computed<ProfileStat[]>(() =>
  selectedKeys.value.map((key) => ({ key, value: statValues.value.get(key) ?? 0 })),
);

const toggleStat = async (key: string) => {
  const previous = [...selectedKeys.value];
  const next = previous.includes(key)
    ? previous.filter((selected) => selected !== key)
    : [...previous, key];

  if (next.length > MAX_CARD_STATS) return;

  selectedKeys.value = next;

  try {
    await updateCardStats.execute(next);
  } catch {
    selectedKeys.value = previous;
  }
};

onMounted(() => {
  void fetchMe.execute();
  void fetchMyStats.execute();
  void fetchCardStats.execute();
});
</script>

<style scoped>
.profile__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile__preview {
  display: flex;
  justify-content: center;
}

/* The preview keeps card proportions on wide screens instead of stretching
   into a banner - it should look like the thing friends will actually see. */
.profile__preview > * {
  max-width: 420px;
}

.profile__privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: -0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.profile__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile__saving {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

.profile__picker-hint {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.profile__stat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
}

@media (min-width: 641px) {
  .profile__actions {
    flex-direction: row;
  }

  .profile__stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
