import type { Workout as T, MutateWorkout as M } from '@/types/gym';
import { useCachedApi, useMutation } from '../api/useCacheApi';
import { hydrateWorkout } from './mocks/hydrate';
import { addMyWorkout, findMyWorkoutById, getMyWorkouts, removeMyWorkout, replaceMyWorkout } from './mocks/workouts.mock';
import { mockDelay, toMockResponse } from './utils/useMockApi';

const buildKey = (entryId?: string) => {
  const base = `workouts`;
  return entryId !== undefined ? base + `_${entryId}` : base;
};

/**
 * Stands in for the real `/workouts` endpoint until the backend is reachable
 * from the frontend dev server again. Scoped to "my" workouts only, mirroring
 * the real endpoint (it's always scoped to the authenticated user). Swapping
 * this back to `useApiClient` calls is the only thing needed to go live.
 *
 * Reads/writes go through mocks/workouts.mock.ts's shared store rather than
 * a private copy here, so a workout created via this composable is
 * immediately visible to useWorkoutDetail.ts too (which resolves *any*
 * workout by id, e.g. right after this composable's create redirects to
 * its detail page).
 */
export default function useWorkouts() {
  type GetList = [];
  type GetSingle = [...GetList, workoutId: string];
  type Create = [...GetList, payload: M];
  type Update = [...GetSingle, payload: M];

  const fetchWorkouts = useCachedApi<T[], GetList>(
    () => buildKey(),
    async () => {
      await mockDelay();
      return toMockResponse([...getMyWorkouts()]);
    },
  );

  const fetchWorkout = useCachedApi<T, GetSingle>(
    (workoutId) => buildKey(workoutId),
    async (workoutId) => {
      await mockDelay();
      const workout = findMyWorkoutById(workoutId);
      if (!workout) throw new Error(`Workout "${workoutId}" was not found.`);
      return toMockResponse(workout);
    },
  );

  const createWorkout = useMutation<T, Create>(
    async (payload) => {
      await mockDelay();
      const created = hydrateWorkout(payload);
      addMyWorkout(created);
      return toMockResponse(created);
    },
    {
      itemKeyFactory: (result) => buildKey(result.id),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, result) => [...currentList, result],
    },
  );

  const updateWorkout = useMutation<T, Update>(
    async (workoutId, payload) => {
      await mockDelay();
      const existing = findMyWorkoutById(workoutId);
      if (!existing) throw new Error(`Workout "${workoutId}" was not found.`);

      const updated: T = { ...hydrateWorkout(payload), id: existing.id, createdAt: existing.createdAt };
      replaceMyWorkout(workoutId, updated);
      return toMockResponse(updated);
    },
    {
      itemKeyFactory: (result) => buildKey(result.id),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, result) =>
        currentList.map((item) => (item.id === result.id ? result : item)),
    },
  );

  const deleteWorkout = useMutation<void, GetSingle, T>(
    async (workoutId) => {
      await mockDelay();
      removeMyWorkout(workoutId);
      return toMockResponse(undefined as unknown as void);
    },
    {
      itemKeyFactory: (_, workoutId) => buildKey(workoutId),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, _, workoutId) =>
        currentList.filter((item) => item.id !== workoutId),
    },
  );

  return { fetchWorkouts, fetchWorkout, createWorkout, updateWorkout, deleteWorkout };
}
