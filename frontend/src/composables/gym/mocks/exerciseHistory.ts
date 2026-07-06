import type { WorkoutExercise } from '@/types/gym';
import { getMyWorkouts } from './workouts.mock';

/**
 * "Known exercises" and "what did I do last time" are scoped to the current
 * user's own history only - suggesting a friend's squat weight as if it
 * were yours would be actively unhelpful, not just irrelevant.
 *
 * Recomputed on every call rather than memoized: the underlying workouts
 * are a live, mutable store (see workouts.mock.ts), so a workout logged
 * earlier in the session needs to show up here too - e.g. typing the same
 * exercise name again later in the same visit. The mock dataset is tiny, so
 * there's no real cost to rebuilding this on each call.
 */
const buildHistory = (): Map<string, { name: string; lastPerformedAt: Date; exercise: WorkoutExercise }> => {
  const history = new Map<string, { name: string; lastPerformedAt: Date; exercise: WorkoutExercise }>();

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
