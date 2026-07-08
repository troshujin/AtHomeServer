import type { Paginated } from '@/types/api';
import { useMockActivityFeed } from './utils/useMockApi';
import type { Workout } from '@/types/gym';

export default function useFriends() {
  const fetchFriendActivity = useMockActivityFeed<Paginated<Workout>>(
    'gym_friend_activity',
    () => ({ items: [], total: 0, skip: 0, limit: 20 }),
  );

  return { fetchFriendActivity };
}
