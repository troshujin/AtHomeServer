import { globalCache } from '@/composables/api/useCacheApi';
import type { Workout, WorkoutExercise } from '@/types/gym';

/**
 * "Known exercises" and "what did I do last time" are scoped to the current
 * user's own history only - suggesting a friend's squat weight as if it
 * were yours would be actively unhelpful, not just irrelevant.
 *
 * Reads the real `/workouts` list straight out of the shared cache (the
 * `workouts` key useWorkout.ts's fetchWorkouts fills), so it stays in sync
 * with creates/edits without owning any fetching itself. The form view
 * warms that cache on mount; until it lands this just returns nothing,
 * which callers already treat as "no suggestions".
 *
 * Recomputed on every call rather than memoized: a user's history is small,
 * and the underlying cache entry can change under us at any time.
 */
const getMyWorkouts = (): Workout[] =>
  (globalCache.get('workouts')?.data.value as Workout[] | null) ?? [];

const buildHistory = (): Map<string, ExerciseHistoryEntry> => {
  const history = new Map<string, ExerciseHistoryEntry>();

  for (const workout of getMyWorkouts()) {
    for (const exercise of workout.exercises) {
      const key = exercise.name.trim().toLowerCase();
      const existing = history.get(key);
      if (!existing || exercise.startedAt > existing.lastPerformedAt) {
        history.set(key, { name: exercise.name, lastPerformedAt: exercise.startedAt, exercise });
      }
    }
  }

  return history;
};

export interface ExerciseHistoryEntry {
  name: string;
  lastPerformedAt: Date;
  exercise: WorkoutExercise;
}

/** Every exercise name the user has ever logged, most recently used first. */
export const getKnownExerciseNames = (): string[] =>
  Array.from(buildHistory().values())
    .sort((a, b) => b.lastPerformedAt.getTime() - a.lastPerformedAt.getTime())
    .map((entry) => entry.name);

export const findExerciseHistory = (name: string): ExerciseHistoryEntry | undefined =>
  buildHistory().get(name.trim().toLowerCase());
