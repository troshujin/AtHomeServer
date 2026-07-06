import type { Workout, WorkoutStatus } from '@/types/gym';

/** Newest-first comparator - the backend returns workouts in arbitrary DB order. */
export const byMostRecent = (a: Workout, b: Workout): number =>
  b.startedAt.getTime() - a.startedAt.getTime();

export function useWorkoutUtils(workout: Workout) {
  const getStatus = (): WorkoutStatus => (workout.endedAt ? 'finished' : 'in-progress');
  const getVolume = (): number => {
    return workout.exercises.reduce((exerciseAcc, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
        const setVolume = set.reps.reduce((repAcc, rep) => {
          return repAcc + rep.weight * rep.amount;
        }, 0);
        return setAcc + setVolume;
      }, 0);
      return exerciseAcc + exerciseVolume;
    }, 0);
  };

  return {
    getVolume,
    getStatus,
    workout,
  };
}
