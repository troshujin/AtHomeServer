import type { GymActivityEntry } from './mocks/workouts.mock';
import { mockPromotedActivity } from './mocks/workouts.mock';
import { useMockActivityFeed } from './utils/useMockApi';

export default function usePromoted() {
  const fetchPromotedActivity = useMockActivityFeed<GymActivityEntry[]>(
    'gym_promoted_activity',
    () => mockPromotedActivity,
  );

  return { fetchPromotedActivity };
}
