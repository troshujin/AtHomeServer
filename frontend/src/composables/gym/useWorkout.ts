import type { Workout as T, MutateWorkout as M } from '@/types/gym';
import { useCachedApi, useMutation } from '../api/useCacheApi';
import { hydrateWorkout } from './mocks/hydrate';
import { mockMyWorkouts } from './mocks/workouts.mock';
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
 */
let mockWorkouts: T[] = [...mockMyWorkouts];

export default function useWorkouts() {
  type GetList = [];
  type GetSingle = [...GetList, workoutId: string];
  type Create = [...GetList, payload: M];
  type Update = [...GetSingle, payload: M];

  const fetchWorkouts = useCachedApi<T[], GetList>(
    () => buildKey(),
    async () => {
      await mockDelay();
      return toMockResponse([...mockWorkouts]);
    },
  );

  const fetchWorkout = useCachedApi<T, GetSingle>(
    (workoutId) => buildKey(workoutId),
    async (workoutId) => {
      await mockDelay();
      const workout = mockWorkouts.find((item) => item.id === workoutId);
      if (!workout) throw new Error(`Workout "${workoutId}" was not found.`);
      return toMockResponse(workout);
    },
  );

  const createWorkout = useMutation<T, Create>(
    async (payload) => {
      await mockDelay();
      const created = hydrateWorkout(payload);
      mockWorkouts = [created, ...mockWorkouts];
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
      const existing = mockWorkouts.find((item) => item.id === workoutId);
      if (!existing) throw new Error(`Workout "${workoutId}" was not found.`);

      const updated: T = { ...hydrateWorkout(payload), id: existing.id, createdAt: existing.createdAt };
      mockWorkouts = mockWorkouts.map((item) => (item.id === workoutId ? updated : item));
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
      mockWorkouts = mockWorkouts.filter((item) => item.id !== workoutId);
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
