from datetime import datetime

from core.common.schema import APIBaseModel, BaseEntity, BaseSearchQuery


class FetchWorkoutFilters(BaseSearchQuery):
    search_query: str | None = None


class WorkoutRepDto(BaseEntity):
    weight: float
    amount: int


class WorkoutSetDto(BaseEntity):
    reps: list[WorkoutRepDto]


class WorkoutExerciseDto(BaseEntity):
    name: str
    sets: list[WorkoutSetDto]
    started_at: datetime
    ended_at: datetime | None


class WorkoutDto(BaseEntity):
    exercises: list[WorkoutExerciseDto]
    started_at: datetime
    ended_at: datetime | None


class MutateWorkoutRepDto(APIBaseModel):
    weight: float
    amount: int


class MutateWorkoutSetDto(APIBaseModel):
    reps: list[MutateWorkoutRepDto]


class MutateWorkoutExerciseDto(APIBaseModel):
    name: str
    sets: list[MutateWorkoutSetDto]
    started_at: datetime
    ended_at: datetime | None


class MutateWorkoutDto(APIBaseModel):
    exercises: list[MutateWorkoutExerciseDto]
    started_at: datetime
    ended_at: datetime | None
