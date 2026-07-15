import type { ProfileCardStats, ProfileStat } from '@/types/profile';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi, useMutation } from '../api/useCacheApi';

const STATS_KEY = 'me_stats';
const CARD_STATS_KEY = 'me_card_stats';

/**
 * The profile-card stat data: the full catalog of stats the user could pin
 * (`/me/stats`, values computed fresh by the backend) and the pinned
 * selection itself (`/me/card-stats`, slot-ordered - index 0 is the card's
 * hero slot). Saving the selection patches the cached copy in place via
 * itemKeyFactory, so the card preview and any future consumer stay in sync
 * without a refetch.
 */
export default function useProfileStats() {
  const api = useApiClient();

  const fetchMyStats = useCachedApi<ProfileStat[], []>(
    () => STATS_KEY,
    () => api.get<ProfileStat[]>('/me/stats'),
  );

  const fetchCardStats = useCachedApi<ProfileCardStats, []>(
    () => CARD_STATS_KEY,
    () => api.get<ProfileCardStats>('/me/card-stats'),
  );

  const updateCardStats = useMutation<ProfileCardStats, [statKeys: string[]]>(
    (statKeys) => api.put<ProfileCardStats, { statKeys: string[] }>('/me/card-stats', { statKeys }),
    {
      itemKeyFactory: () => CARD_STATS_KEY,
    },
  );

  const updateCardPrivacy = useMutation<ProfileCardStats, [isPrivate: boolean]>(
    (isPrivate) =>
      api.put<ProfileCardStats, { isPrivate: boolean }>('/me/card-privacy', { isPrivate }),
    {
      itemKeyFactory: () => CARD_STATS_KEY,
    },
  );

  return { fetchMyStats, fetchCardStats, updateCardStats, updateCardPrivacy };
}
