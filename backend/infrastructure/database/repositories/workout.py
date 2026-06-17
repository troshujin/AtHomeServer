from sqlalchemy.orm import selectinload
from typing import override
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.database.models import Workout, WorkoutExercise, WorkoutSet
from infrastructure.database.repositories._base import BaseRepository


class WorkoutRepository(BaseRepository[Workout]):
    def __init__(self, session: AsyncSession):
        super().__init__(Workout, session)

    @override
    def query_options(self, query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
        query = query.options(
            selectinload(Workout.exercises)
            .selectinload(WorkoutExercise.sets)
            .selectinload(WorkoutSet.reps)
        )
        return query
