import type { Paginated } from '@/types/api';
import type { Workout } from '@/types/gym';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi } from '../api/useCacheApi';

const PROMOTED_KEY = 'workouts_promoted';

/**
 * The most recent finished workouts, network-wide - see
 * GetPromotedWorkoutsUseCase on the backend. There's no friends/follow
 * model, so "promoted" is simply recency: the simplest possible ranking
 * for a public activity feed. Each item already embeds its owner
 * (WorkoutDto.user), unlike useWorkout.ts's "my workouts" list which never
 * needed to say who it belongs to.
 */
export default function usePromoted() {
  const api = useApiClient();

  const fetchPromotedActivity = useCachedApi<Paginated<Workout>, []>(
    () => PROMOTED_KEY,
    () => api.get<Paginated<Workout>>('/workouts/promoted'),
  );

  return { fetchPromotedActivity };
}
