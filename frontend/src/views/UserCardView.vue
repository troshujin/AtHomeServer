<template>
  <PageShell>
    <BackLink to="/friends">Back to Friends</BackLink>

    <div v-if="loading" class="user-card__skeleton" aria-hidden="true">
      <SkeletonBlock height="13rem" border-radius="1.25rem" />
      <SkeletonBlock height="3.5rem" />
    </div>

    <EmptyState v-else-if="!card" message="This user doesn't exist, or isn't visible to you.">
      <AppButton variant="primary" to="/friends">Back to Friends</AppButton>
    </EmptyState>

    <template v-else>
      <section class="user-card__preview" aria-label="Profile card">
        <ProfileCard
          v-if="card.isVisible"
          :user="cardUser"
          :member-since="card.user.memberSince"
          :stats="card.stats"
        />

        <!-- The hidden state is explicit, not a blank gap: whose card it is
             and why there's nothing to see. -->
        <div v-else class="user-card__hidden">
          <span class="user-card__hidden-avatar" aria-hidden="true">{{ initials }}</span>
          <p class="user-card__hidden-name">{{ card.user.username }}</p>
          <p class="user-card__hidden-message">
            <Icon icon="md.lock" />
            {{ card.user.username }}'s card is private — their stats are hidden.
          </p>
        </div>
      </section>

      <template v-if="isMe">
        <p class="user-card__note">This is your card — this is what friends see.</p>
        <AppButton variant="primary" block to="/profile">Edit your card</AppButton>
      </template>

      <template v-else-if="relationsReady">
        <template v-if="iBlockedThem">
          <p class="user-card__note">
            You've blocked {{ card.user.username }}. They can't send you friend requests.
          </p>
          <AppButton variant="ghost" block @click="unblock">Unblock</AppButton>
        </template>

        <template v-else-if="friendRelation">
          <p class="user-card__note">
            <BadgePill>Friends</BadgePill>
            You and {{ card.user.username }} are friends.
          </p>
          <div class="user-card__actions">
            <AppButton variant="ghost" block @click="askUnfriend(friendRelation)">
              Unfriend
            </AppButton>
            <AppButton variant="ghost" block @click="askBlock(cardUser)">Block</AppButton>
          </div>
        </template>

        <template v-else-if="incomingRelation">
          <p class="user-card__note">{{ card.user.username }} sent you a friend request.</p>
          <div class="user-card__actions">
            <AppButton variant="primary" block @click="accept(incomingRelation)">
              Accept request
            </AppButton>
            <AppButton variant="ghost" block @click="ignore(incomingRelation)">Ignore</AppButton>
            <AppButton variant="ghost" block @click="askBlock(cardUser)">Block</AppButton>
          </div>
        </template>

        <template v-else-if="outgoingRelation">
          <p class="user-card__note">
            <BadgePill variant="accent">Pending</BadgePill>
            Friend request sent — waiting on {{ card.user.username }}.
          </p>
          <div class="user-card__actions">
            <AppButton variant="ghost" block @click="askCancel(outgoingRelation)">
              Cancel request
            </AppButton>
            <AppButton variant="ghost" block @click="askBlock(cardUser)">Block</AppButton>
          </div>
        </template>

        <template v-else>
          <AppButton
            variant="primary"
            size="lg"
            block
            :disabled="requestFriend.loading.value"
            @click="addFriend"
          >
            <Icon icon="md.person-add" />
            Add friend
          </AppButton>
          <AppButton variant="ghost" block @click="askBlock(cardUser)">Block</AppButton>
        </template>
      </template>
    </template>

    <ConfirmDialog
      v-if="pendingAction"
      :title="confirmCopy.title"
      :message="confirmCopy.message"
      :confirm-label="confirmCopy.confirmLabel"
      :loading="confirmLoading"
      @confirm="runPendingAction"
      @close="closeConfirm"
    />
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import BadgePill from '@/components/common/BadgePill.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Icon from '@/components/common/Icon.vue';
import PageShell from '@/components/common/PageShell.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import useCurrentUser from '@/composables/auth/useCurrentUser';
import useUserCard from '@/composables/profile/useUserCard';
import useRelationActions from '@/composables/relations/useRelationActions';
import useUserRelations from '@/composables/relations/useUserRelations';
import type { User } from '@/types/user';

/**
 * The page a friend-request QR/short-link lands on: another user's profile
 * card (or its explicit private/hidden state) plus the relationship-aware
 * action - add friend, respond to their request, cancel yours, or block.
 */
const props = defineProps<{
  id: string;
}>();

const { fetchMe } = useCurrentUser();
const { fetchUserCard } = useUserCard();
const { fetchRelations, fetchBlocks, requestFriend, acceptRequest, removeRelation, unblockUser } =
  useUserRelations();

const card = fetchUserCard.data;
const loading = computed(() => fetchUserCard.loading.value && !card.value);

const isMe = computed(() => fetchMe.data.value?.id === props.id);

const initials = computed(() => (card.value?.user.username ?? '').slice(0, 2).toUpperCase());

// ProfileCard and the relation actions expect the app's `User` shape.
const cardUser = computed<User>(() => ({
  id: card.value?.user.id ?? props.id,
  username: card.value?.user.username ?? '',
  createdAt: card.value?.user.memberSince ?? new Date(0),
  updatedAt: card.value?.user.memberSince ?? new Date(0),
}));

const relationsReady = computed(
  () => fetchRelations.data.value !== null && fetchBlocks.data.value !== null,
);

const friendRelation = computed(
  () =>
    fetchRelations.data.value?.friends.find((relation) => relation.user.id === props.id) ?? null,
);
const incomingRelation = computed(
  () =>
    fetchRelations.data.value?.incoming.find((relation) => relation.user.id === props.id) ?? null,
);
const outgoingRelation = computed(
  () =>
    fetchRelations.data.value?.outgoing.find((relation) => relation.user.id === props.id) ?? null,
);
const iBlockedThem = computed(
  () => fetchBlocks.data.value?.some((block) => block.user.id === props.id) ?? false,
);

const addFriend = () => void requestFriend.execute(props.id);
const accept = (relation: { id: string }) => void acceptRequest.execute(relation.id);
const ignore = (relation: { id: string }) => void removeRelation.execute(relation.id);
const unblock = () => void unblockUser.execute(props.id);

const {
  pendingAction,
  confirmLoading,
  confirmCopy,
  askCancel,
  askUnfriend,
  askBlock,
  closeConfirm,
  runPendingAction,
} = useRelationActions();

const load = (id: string) => {
  void fetchMe.execute();
  void fetchUserCard.execute(id);
  void fetchRelations.execute();
  void fetchBlocks.execute();
};

onMounted(() => load(props.id));

watch(
  () => props.id,
  (id) => load(id),
);
</script>

<style scoped>
.user-card__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.user-card__preview {
  display: flex;
  justify-content: center;
}

/* Same preview cap as the profile page - it should read as a card. */
.user-card__preview > * {
  max-width: 420px;
  width: 100%;
}

.user-card__hidden {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.25rem;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--surface-shadow);
}

.user-card__hidden-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.user-card__hidden-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-secondary);
}

.user-card__hidden-message {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.user-card__note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.85;
}

.user-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

@media (min-width: 641px) {
  .user-card__actions {
    flex-direction: row;
  }
}
</style>
