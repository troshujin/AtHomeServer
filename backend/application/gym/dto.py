from datetime import datetime

from core.common.schema import APIBaseModel, BaseSearchQuery


class FetchWorkoutFilters(BaseSearchQuery):
    search_query: str | None = None


class BaseEntity(APIBaseModel):
    id: str
    created_at: datetime
    updated_at: datetime


class WorkoutRep(BaseEntity):
    weight: float
    amount: int


class WorkoutSet(BaseEntity):
    reps: list[WorkoutRep]


class WorkoutExercise(BaseEntity):
    name: str
    sets: list[WorkoutSet]
    started_at: datetime
    ended_at: datetime


class Workout(BaseEntity):
    exercises: list[WorkoutExercise]
    started_at: datetime
    ended_at: datetime


class MutateWorkoutRep(APIBaseModel):
    weight: float
    amount: int


class MutateWorkoutSet(APIBaseModel):
    reps: list[MutateWorkoutRep]


class MutateWorkoutExercise(APIBaseModel):
    name: str
    sets: list[MutateWorkoutSet]
    started_at: datetime
    ended_at: datetime


class MutateWorkout(APIBaseModel):
    exercises: list[MutateWorkoutExercise]
    started_at: datetime
    ended_at: datetime
