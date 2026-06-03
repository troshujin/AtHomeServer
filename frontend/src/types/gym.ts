export interface Workout {
  id: string;
  exercises: WorkoutExercise[];
  startedAt: Date;
  endedAt: Date;
}

export interface WorkoutExercise {
  name: string;
  sets: WorkoutSet[];
  startedAt: Date;
  endedAt: Date;
}

export interface WorkoutSet {
  reps: WorkoutRep[];
}

export interface WorkoutRep {
  weight: number;
  amount: number;
}
