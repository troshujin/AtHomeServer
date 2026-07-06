import type { GymActivityEntry } from './mocks/workouts.mock';
import { mockPromotedActivity } from './mocks/workouts.mock';
import { useMockActivityFeed } from './utils/useMockApi';

/**
 * Still mock data: the backend has no promoted/community feed endpoint.
 * When one exists, swap the fetcher for a real `useApiClient` call the way
 * useWorkout.ts does.
 */
export default function usePromoted() {
  const fetchPromotedActivity = useMockActivityFeed<GymActivityEntry[]>(
    'gym_promoted_activity',
    () => mockPromotedActivity,
  );

  return { fetchPromotedActivity };
}
