import type { BlockedUser, UserRelation, UserRelations } from '@/types/relations';
import { useApiClient } from '../api/useApiClient';
import { invalidateCache, useCachedApi, useMutation } from '../api/useCacheApi';

// Two distinct prefixes on purpose: invalidateCache matches `${prefix}` /
// `${prefix}_` exactly, so relations and blocks can be dropped independently.
const RELATIONS_KEY = 'user_relations';
const BLOCKS_KEY = 'user_blocks';

/**
 * Friend relations and blocks. Every mutation invalidates the grouped
 * relations cache (and blocks where relevant) rather than patching it -
 * a single action can move an entry between groups (accept: incoming →
 * friends) or remove it from several (block severs any relation), so a
 * refetch is the only honest update.
 */
export default function useUserRelations() {
  const api = useApiClient();

  const fetchRelations = useCachedApi<UserRelations, []>(
    () => RELATIONS_KEY,
    () => api.get<UserRelations>('/user_relations'),
  );

  const fetchBlocks = useCachedApi<BlockedUser[], []>(
    () => BLOCKS_KEY,
    () => api.get<BlockedUser[]>('/user_relations/blocks'),
  );

  const requestFriend = useMutation<UserRelation, [userId: string]>(
    (userId) => api.post<UserRelation, undefined>(`/user_relations/friends/${userId}`),
    { onSuccess: () => invalidateCache(RELATIONS_KEY) },
  );

  const acceptRequest = useMutation<UserRelation, [relationId: string]>(
    (relationId) => api.post<UserRelation, undefined>(`/user_relations/${relationId}/accept`),
    { onSuccess: () => invalidateCache(RELATIONS_KEY) },
  );

  /** Ignore an incoming request, cancel an outgoing one, or unfriend - the
   * backend treats all three as the same deletion. */
  const removeRelation = useMutation<void, [relationId: string]>(
    (relationId) => api.delete<void>(`/user_relations/${relationId}`),
    { onSuccess: () => invalidateCache(RELATIONS_KEY) },
  );

  const blockUser = useMutation<BlockedUser, [userId: string]>(
    (userId) => api.post<BlockedUser, undefined>(`/user_relations/blocks/${userId}`),
    {
      onSuccess: () => {
        // Blocking also severs any relation server-side.
        invalidateCache(RELATIONS_KEY);
        invalidateCache(BLOCKS_KEY);
      },
    },
  );

  const unblockUser = useMutation<void, [userId: string]>(
    (userId) => api.delete<void>(`/user_relations/blocks/${userId}`),
    { onSuccess: () => invalidateCache(BLOCKS_KEY) },
  );

  return {
    fetchRelations,
    fetchBlocks,
    requestFriend,
    acceptRequest,
    removeRelation,
    blockUser,
    unblockUser,
  };
}
