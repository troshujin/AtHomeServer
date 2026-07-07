import type { Paginated } from '@/types/api';
import type { GymActivityEntry } from './mocks/workouts.mock';
import { useMockActivityFeed } from './utils/useMockApi';

export type { GymActivityEntry };

/**
 * Still mock data: the backend has no friends endpoint (`/workouts` is
 * always scoped to the authenticated user, and there's no friend
 * relationship model at all yet). When one exists, swap the fetcher for a
 * real `useApiClient` call the way usePromoted.ts now does. Wrapped in the
 * same `Paginated` shape the real feeds use so GymActivityFeed.vue doesn't
 * need to special-case which feed is real.
 */
export default function useFriends() {
  const fetchFriendActivity = useMockActivityFeed<Paginated<GymActivityEntry>>(
    'gym_friend_activity',
    () => ({ items: [], total: 0, skip: 0, limit: 20 }),
  );

  return { fetchFriendActivity };
}
