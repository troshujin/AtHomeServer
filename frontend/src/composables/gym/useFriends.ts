import type { GymActivityEntry } from './mocks/workouts.mock';
import { mockFriendActivity } from './mocks/workouts.mock';
import { useMockActivityFeed } from './utils/useMockApi';

export type { GymActivityEntry };

/**
 * Still mock data: the backend has no friends endpoint (`/workouts` is
 * always scoped to the authenticated user, and there's no friend
 * relationship model at all yet). When one exists, swap the fetcher for a
 * real `useApiClient` call the way useWorkout.ts does.
 */
export default function useFriends() {
  const fetchFriendActivity = useMockActivityFeed<GymActivityEntry[]>(
    'gym_friend_activity',
    () => mockFriendActivity,
  );

  return { fetchFriendActivity };
}
