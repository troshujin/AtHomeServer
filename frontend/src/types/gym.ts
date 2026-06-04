import type { BaseEntity } from "./base";

export interface Workout extends BaseEntity {
  exercises: WorkoutExercise[];
  startedAt: Date;
  endedAt: Date;
}

export interface WorkoutExercise extends BaseEntity {
  name: string;
  sets: WorkoutSet[];
  startedAt: Date;
  endedAt: Date;
}

export interface WorkoutSet extends BaseEntity {
  reps: WorkoutRep[];
}

export interface WorkoutRep extends BaseEntity {
  weight: number;
  amount: number;
}

export interface MutateWorkout {
  exercises: MutateWorkoutExercise[];
  startedAt: Date;
  endedAt: Date;
}

export interface MutateWorkoutExercise {
  name: string;
  sets: MutateWorkoutSet[];
  startedAt: Date;
  endedAt: Date;
}

export interface MutateWorkoutSet {
  reps: MutateWorkoutRep[];
}

export interface MutateWorkoutRep {
  weight: number;
  amount: number;
}
