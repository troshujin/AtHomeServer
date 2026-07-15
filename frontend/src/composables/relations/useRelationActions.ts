import { computed, ref } from 'vue';
import type { UserRelation } from '@/types/relations';
import type { User } from '@/types/user';
import useUserRelations from './useUserRelations';

type PendingAction =
  | { kind: 'cancel'; relation: UserRelation }
  | { kind: 'unfriend'; relation: UserRelation }
  | { kind: 'block'; user: User };

/**
 * The confirm-gated relation actions (cancel a sent request, unfriend,
 * block) shared by the friends page and the profile card page: one pending
 * action at a time, copy for the ConfirmDialog, and the execute-on-confirm
 * handler. Accept/ignore/unblock don't live here - they're reversible by
 * just asking again, so they act without a dialog (STYLE_GUIDE §8).
 */
export default function useRelationActions() {
  const { removeRelation, blockUser } = useUserRelations();

  const pendingAction = ref<PendingAction | null>(null);
  const confirmLoading = ref(false);

  const askCancel = (relation: UserRelation) => {
    pendingAction.value = { kind: 'cancel', relation };
  };
  const askUnfriend = (relation: UserRelation) => {
    pendingAction.value = { kind: 'unfriend', relation };
  };
  const askBlock = (user: User) => {
    pendingAction.value = { kind: 'block', user };
  };
  const closeConfirm = () => {
    pendingAction.value = null;
  };

  const confirmCopy = computed(() => {
    const action = pendingAction.value;
    if (!action) return { title: '', message: '', confirmLabel: '' };

    switch (action.kind) {
      case 'cancel':
        return {
          title: 'Cancel this request?',
          message: `Your friend request to ${action.relation.user.username} will be withdrawn.`,
          confirmLabel: 'Cancel request',
        };
      case 'unfriend':
        return {
          title: `Unfriend ${action.relation.user.username}?`,
          message: 'You can always send them a new request later.',
          confirmLabel: 'Unfriend',
        };
      case 'block':
        return {
          title: `Block ${action.user.username}?`,
          message:
            "They won't be able to send you friend requests, and any friendship or pending request between you is removed.",
          confirmLabel: 'Block',
        };
    }
  });

  const runPendingAction = async () => {
    const action = pendingAction.value;
    if (!action) return;

    confirmLoading.value = true;
    try {
      if (action.kind === 'block') {
        await blockUser.execute(action.user.id);
      } else {
        await removeRelation.execute(action.relation.id);
      }
      pendingAction.value = null;
    } catch {
      // The API client already toasts the failure; keep the dialog open so
      // the user can retry or bail.
    } finally {
      confirmLoading.value = false;
    }
  };

  return {
    pendingAction,
    confirmLoading,
    confirmCopy,
    askCancel,
    askUnfriend,
    askBlock,
    closeConfirm,
    runPendingAction,
  };
}
