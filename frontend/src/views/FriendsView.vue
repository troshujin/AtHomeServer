<template>
  <PageShell>
    <BackLink to="/profile">Back to Profile</BackLink>

    <PageHeader
      title="Friends"
      subtitle="Requests, your friends, and who you've blocked — all in one place."
    />

    <AppButton variant="primary" size="lg" block @click="isAddOpen = true">
      + Add friend
    </AppButton>

    <div v-if="loading" class="friends__skeleton" aria-hidden="true">
      <SkeletonBlock height="9rem" />
      <SkeletonBlock height="14rem" />
    </div>

    <template v-else>
      <SectionCard v-if="incoming.length" title="Friend requests">
        <ul class="friends__list">
          <FriendRow v-for="relation in incoming" :key="relation.id" :user="relation.user">
            <AppButton variant="primary" size="sm" @click="accept(relation)">Accept</AppButton>
            <AppButton variant="ghost" size="sm" @click="ignore(relation)">Ignore</AppButton>
            <AppButton variant="ghost" size="sm" @click="askBlock(relation.user)">Block</AppButton>
          </FriendRow>
        </ul>
      </SectionCard>

      <SectionCard v-if="outgoing.length" title="Sent requests">
        <ul class="friends__list">
          <FriendRow v-for="relation in outgoing" :key="relation.id" :user="relation.user">
            <BadgePill variant="accent">Pending</BadgePill>
            <AppButton variant="ghost" size="sm" @click="askCancel(relation)">Cancel</AppButton>
            <AppButton variant="ghost" size="sm" @click="askBlock(relation.user)">Block</AppButton>
          </FriendRow>
        </ul>
      </SectionCard>

      <SectionCard title="Friends">
        <EmptyState
          v-if="!friends.length"
          message="No friends yet — tap “Add friend” above to share your code."
        />
        <ul v-else class="friends__list">
          <FriendRow v-for="relation in friends" :key="relation.id" :user="relation.user">
            <AppButton variant="ghost" size="sm" @click="askUnfriend(relation)">Unfriend</AppButton>
            <AppButton variant="ghost" size="sm" @click="askBlock(relation.user)">Block</AppButton>
          </FriendRow>
        </ul>
      </SectionCard>

      <SectionCard v-if="blocks.length" title="Blocked">
        <ul class="friends__list">
          <FriendRow v-for="block in blocks" :key="block.id" :user="block.user">
            <AppButton variant="ghost" size="sm" @click="unblock(block)">Unblock</AppButton>
          </FriendRow>
        </ul>
      </SectionCard>
    </template>

    <AddFriendModal
      v-if="isAddOpen && meId"
      :user-id="meId"
      @close="isAddOpen = false"
      @scan="openScanner"
    />

    <QrScannerModal v-if="isScannerOpen" @close="isScannerOpen = false" />

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
import { computed, onMounted, ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import BadgePill from '@/components/common/BadgePill.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import AddFriendModal from '@/components/friends/AddFriendModal.vue';
import FriendRow from '@/components/friends/FriendRow.vue';
import QrScannerModal from '@/components/friends/QrScannerModal.vue';
import useCurrentUser from '@/composables/auth/useCurrentUser';
import useRelationActions from '@/composables/relations/useRelationActions';
import useUserRelations from '@/composables/relations/useUserRelations';
import type { BlockedUser, UserRelation } from '@/types/relations';

const { fetchMe } = useCurrentUser();
const { fetchRelations, fetchBlocks, acceptRequest, removeRelation, unblockUser } =
  useUserRelations();

const meId = computed(() => fetchMe.data.value?.id ?? null);

const loading = computed(
  () => (fetchRelations.loading.value || fetchBlocks.loading.value) && !fetchRelations.data.value,
);

const friends = computed(() => fetchRelations.data.value?.friends ?? []);
const incoming = computed(() => fetchRelations.data.value?.incoming ?? []);
const outgoing = computed(() => fetchRelations.data.value?.outgoing ?? []);
const blocks = computed(() => fetchBlocks.data.value ?? []);

const isAddOpen = ref(false);
const isScannerOpen = ref(false);

const openScanner = () => {
  isAddOpen.value = false;
  isScannerOpen.value = true;
};

/* Accepting and ignoring are reversible-by-asking-again, so they act
 * immediately; cancelling, unfriending, and blocking go through exactly one
 * ConfirmDialog via useRelationActions (STYLE_GUIDE §8). */
const accept = (relation: UserRelation) => void acceptRequest.execute(relation.id);
const ignore = (relation: UserRelation) => void removeRelation.execute(relation.id);
const unblock = (block: BlockedUser) => void unblockUser.execute(block.user.id);

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

onMounted(() => {
  void fetchMe.execute();
  void fetchRelations.execute();
  void fetchBlocks.execute();
});
</script>

<style scoped>
.friends__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.friends__list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.friends__list > * + * {
  border-top: 1px solid var(--surface-border);
}
</style>
