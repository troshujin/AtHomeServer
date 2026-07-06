import type { Workout } from '@/types/gym';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi } from '../api/useCacheApi';
import useCurrentUser, { toDisplayUser } from '../auth/useCurrentUser';
import { findActivityByWorkoutId, type GymActivityEntry } from './mocks/workouts.mock';
import { mockDelay, toMockResponse } from './utils/useMockApi';

export type { GymActivityEntry };

const buildKey = (workoutId: string) => `workout_detail_${workoutId}`;

/**
 * Resolves the detail page's entry (workout + who did it). My own workouts
 * come from the real `GET /workouts/{id}` (which only ever returns the
 * authenticated user's workouts) paired with `/me` for the byline. Friend
 * and promoted workouts still only exist as mock data - the backend has no
 * friends/promoted endpoint yet - and are recognizable by their `mock-` id
 * prefix, so those keep resolving from the local mock feeds.
 */
export default function useWorkoutDetail() {
  const api = useApiClient();
  const { fetchMe } = useCurrentUser();

  const fetchWorkoutDetail = useCachedApi<GymActivityEntry, [workoutId: string]>(
    (workoutId) => buildKey(workoutId),
    async (workoutId) => {
      if (workoutId.startsWith('mock-')) {
        await mockDelay();
        const entry = findActivityByWorkoutId(workoutId);
        if (!entry) throw new Error(`Workout "${workoutId}" was not found.`);
        return toMockResponse(entry);
      }

      const [workoutResponse] = await Promise.all([
        api.get<Workout>(`/workouts/${workoutId}`),
        fetchMe.execute(),
      ]);

      const me = fetchMe.data.value;
      const entry: GymActivityEntry = {
        workout: workoutResponse.data,
        user: me ? toDisplayUser(me) : { id: '', username: 'Me', createdAt: new Date(0), updatedAt: new Date(0) },
      };

      return { ...workoutResponse, data: entry };
    },
    // useWorkout.ts's create/update/delete mutations know how to update
    // *their own* cache keys (the list and `workouts_<id>`), but have no
    // way to know this composable's separate `workout_detail_<id>` entry
    // even exists - so it can't be kept in sync the way useMutation's
    // listUpdater does elsewhere. Editing a workout and landing back on
    // its own detail page (a route this app relies on) would otherwise
    // silently show the pre-edit snapshot for a full minute. Always
    // refetching here costs a brief skeleton flash in exchange for never
    // showing stale data.
    0,
  );

  return { fetchWorkoutDetail };
}
