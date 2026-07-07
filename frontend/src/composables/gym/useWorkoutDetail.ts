import type { Workout } from '@/types/gym';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi } from '../api/useCacheApi';
import { findActivityByWorkoutId, type GymActivityEntry } from './mocks/workouts.mock';
import { mockDelay, toMockResponse } from './utils/useMockApi';

export type { GymActivityEntry };

const buildKey = (workoutId: string) => `workout_detail_${workoutId}`;

const UNKNOWN_USER = { id: '', username: 'Unknown', createdAt: new Date(0), updatedAt: new Date(0) };

/**
 * Resolves the detail page's entry (workout + who did it). Real workouts -
 * both the current user's own and other users' finished ones, now that
 * `GET /workouts/{id}` allows viewing any finished workout - come from
 * that endpoint, which embeds the actual owner directly (WorkoutDto.user),
 * so there's no need to separately assume "it's always me" the way this
 * used to. Friend workouts still only exist as mock data - the backend has
 * no friends endpoint yet - and are recognizable by their `mock-` id
 * prefix, so those keep resolving from the local mock feed.
 */
export default function useWorkoutDetail() {
  const api = useApiClient();

  const fetchWorkoutDetail = useCachedApi<GymActivityEntry, [workoutId: string]>(
    (workoutId) => buildKey(workoutId),
    async (workoutId) => {
      if (workoutId.startsWith('mock-')) {
        await mockDelay();
        const entry = findActivityByWorkoutId(workoutId);
        if (!entry) throw new Error(`Workout "${workoutId}" was not found.`);
        return toMockResponse(entry);
      }

      const workoutResponse = await api.get<Workout>(`/workouts/${workoutId}`);
      const entry: GymActivityEntry = {
        workout: workoutResponse.data,
        user: workoutResponse.data.user ?? UNKNOWN_USER,
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
