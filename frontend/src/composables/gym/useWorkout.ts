import type { Paginated } from '@/types/api';
import type { Workout as T, MutateWorkout as M } from '@/types/gym';
import { useApiClient } from '../api/useApiClient';
import { invalidateCache, useCachedApi, useMutation } from '../api/useCacheApi';

export interface FetchWorkoutsParams {
  skip?: number;
  limit?: number;
  finished?: boolean;
}

// Plural, deliberately distinct from the singular `workout_<id>` item-key
// prefix below - invalidateCache matches on `${prefix}_`, and the two must
// never collide.
const LIST_PREFIX = 'workouts';

/**
 * The params exerciseHistory.ts's cache read expects `GymWorkoutForm.vue`'s
 * on-mount warm-up call to have used - shared here so the two stay pointed
 * at the same cache entry by construction rather than by both hardcoding a
 * matching literal.
 */
export const HISTORY_PARAMS: FetchWorkoutsParams = { limit: 100 };

export const buildListKey = (params?: FetchWorkoutsParams): string => {
  if (!params) return LIST_PREFIX;
  const { skip = 0, limit = 20, finished } = params;
  return `${LIST_PREFIX}_finished_${finished ?? 'any'}_skip_${skip}_limit_${limit}`;
};

const buildListUrl = (params?: FetchWorkoutsParams): string => {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set('skip', String(params.skip));
  if (params?.limit !== undefined) query.set('limit', String(params.limit));
  if (params?.finished !== undefined) query.set('finished', String(params.finished));
  const qs = query.toString();
  return qs ? `/workouts?${qs}` : '/workouts';
};

const buildItemKey = (entryId: string) => `workout_${entryId}`;
const buildItemUrl = (entryId: string) => `/workouts/${entryId}`;

/**
 * The real `/workouts` endpoint is always scoped to the authenticated user,
 * so everything here reads as "my workouts". The list is paginated
 * server-side (see FetchWorkoutsParams) - each distinct params combo gets
 * its own cache entry, so switching pages/filters never wipes another one.
 */
export default function useWorkouts() {
  const api = useApiClient();

  type GetList = [params?: FetchWorkoutsParams];
  type GetSingle = [workoutId: string];
  type Create = [payload: M];
  type Update = [...GetSingle, payload: M];

  const fetchWorkouts = useCachedApi<Paginated<T>, GetList>(
    (params) => buildListKey(params),
    (params) => api.get<Paginated<T>>(buildListUrl(params)),
  );

  const fetchWorkout = useCachedApi<T, GetSingle>(
    (workoutId) => buildItemKey(workoutId),
    (workoutId) => api.get<T>(buildItemUrl(workoutId)),
  );

  // Mutations no longer patch the list in place: with real pagination
  // there's no single array to splice (several pages/filters can be cached
  // at once, and a mutation only knows about the one item it touched).
  // Dropping every cached list page and letting the next visit refetch is
  // simpler and correct, if less optimal than a targeted patch.

  const createWorkout = useMutation<T, Create>(
    (payload) => api.post<T, M>('/workouts', payload),
    {
      itemKeyFactory: (result) => buildItemKey(result.id),
      onSuccess: () => invalidateCache(LIST_PREFIX),
    },
  );

  const updateWorkout = useMutation<T, Update>(
    (workoutId, payload) => api.put<T, M>(buildItemUrl(workoutId), payload),
    {
      itemKeyFactory: (result) => buildItemKey(result.id),
      onSuccess: () => invalidateCache(LIST_PREFIX),
    },
  );

  const deleteWorkout = useMutation<void, GetSingle>(
    (workoutId) => api.delete<void>(buildItemUrl(workoutId)),
    {
      onSuccess: (_data, workoutId) => {
        invalidateCache(buildItemKey(workoutId));
        invalidateCache(LIST_PREFIX);
      },
    },
  );

  return { fetchWorkouts, fetchWorkout, createWorkout, updateWorkout, deleteWorkout };
}
