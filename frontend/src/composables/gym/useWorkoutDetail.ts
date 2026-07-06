import { useCachedApi } from '../api/useCacheApi';
import { findActivityByWorkoutId, type GymActivityEntry } from './mocks/workouts.mock';
import { mockDelay, toMockResponse } from './utils/useMockApi';

export type { GymActivityEntry };

const buildKey = (workoutId: string) => `workout_detail_${workoutId}`;

/**
 * Looks a workout up regardless of who owns it (unlike `useWorkout.ts`,
 * which is scoped to "my" workouts only, mirroring the real backend) -
 * this backs the public-ish `/gym/workouts/:id` detail page, which needs
 * to resolve a friend's or a promoted workout too. See the comment on
 * `mockAllActivity` for the backend gap this papers over for now.
 */
export default function useWorkoutDetail() {
  const fetchWorkoutDetail = useCachedApi<GymActivityEntry, [workoutId: string]>(
    (workoutId) => buildKey(workoutId),
    async (workoutId) => {
      await mockDelay();
      const entry = findActivityByWorkoutId(workoutId);
      if (!entry) throw new Error(`Workout "${workoutId}" was not found.`);
      return toMockResponse(entry);
    },
    // useWorkout.ts's create/update/delete mutations know how to update
    // *their own* cache keys (the list and `workouts_<id>`), but have no
    // way to know this composable's separate `workout_detail_<id>` entry
    // even exists - so it can't be kept in sync the way useMutation's
    // listUpdater does elsewhere. Editing a workout and landing back on
    // its own detail page (a route this app relies on) would otherwise
    // silently show the pre-edit snapshot for a full minute. The mock
    // fetch is a ~350ms delay either way, so always refetching here costs
    // a brief skeleton flash in exchange for never showing stale data.
    0,
  );

  return { fetchWorkoutDetail };
}
