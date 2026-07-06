import type { Workout as T, MutateWorkout as M } from '@/types/gym';
import { useApiClient } from '../api/useApiClient';
import { useCachedApi, useMutation } from '../api/useCacheApi';

const buildKey = (entryId?: string) => {
  const base = `workouts`;
  return entryId !== undefined ? base + `_${entryId}` : base;
};

const buildUrl = (entryId?: string) => {
  const base = `/workouts`;
  return entryId !== undefined ? base + `/${entryId}` : base;
};

/**
 * The real `/workouts` endpoint is always scoped to the authenticated user,
 * so everything here reads as "my workouts".
 */
export default function useWorkouts() {
  const api = useApiClient();

  type GetList = [];
  type GetSingle = [...GetList, workoutId: string];
  type Create = [...GetList, payload: M];
  type Update = [...GetSingle, payload: M];

  const fetchWorkouts = useCachedApi<T[], GetList>(
    () => buildKey(),
    () => api.get<T[]>(buildUrl()),
  );

  const fetchWorkout = useCachedApi<T, GetSingle>(
    (workoutId) => buildKey(workoutId),
    (workoutId) => api.get<T>(buildUrl(workoutId)),
  );

  const createWorkout = useMutation<T, Create>(
    (payload) => api.post<T, M>(buildUrl(), payload),
    {
      itemKeyFactory: (result) => buildKey(result.id),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, result) => [...currentList, result],
    },
  );

  const updateWorkout = useMutation<T, Update>(
    (workoutId, payload) => api.put<T, M>(buildUrl(workoutId), payload),
    {
      itemKeyFactory: (result) => buildKey(result.id),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, result) =>
        currentList.map((item) => (item.id === result.id ? result : item)),
    },
  );

  const deleteWorkout = useMutation<void, GetSingle, T>(
    (workoutId) => api.delete<void>(buildUrl(workoutId)),
    {
      itemKeyFactory: (_, workoutId) => buildKey(workoutId),
      listKeyFactory: () => buildKey(),
      listUpdater: (currentList, _, workoutId) =>
        currentList.filter((item) => item.id !== workoutId),
    },
  );

  return { fetchWorkouts, fetchWorkout, createWorkout, updateWorkout, deleteWorkout };
}
