import type { UserCard } from '@/types/profile';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi } from '../api/useCacheApi';

/** Another user's profile card (`/users/:id/card`) - see the UserCard type
 * for the private/hidden semantics. */
export default function useUserCard() {
  const api = useApiClient();

  const fetchUserCard = useCachedApi<UserCard, [userId: string]>(
    (userId) => `user_card_${userId}`,
    (userId) => api.get<UserCard>(`/users/${userId}/card`),
  );

  return { fetchUserCard };
}
