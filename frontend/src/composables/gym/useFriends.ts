import type { GymActivityEntry } from './mocks/workouts.mock';
import { mockFriendActivity } from './mocks/workouts.mock';
import { useMockActivityFeed } from './utils/useMockApi';

export type { GymActivityEntry };

export default function useFriends() {
  const fetchFriendActivity = useMockActivityFeed<GymActivityEntry[]>(
    'gym_friend_activity',
    () => mockFriendActivity,
  );

  return { fetchFriendActivity };
}
