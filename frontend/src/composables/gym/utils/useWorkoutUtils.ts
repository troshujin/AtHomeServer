import type { Workout } from '@/types/gym';

export function useWorkoutUtils(workout: Workout) {
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
    workout,
  };
}
