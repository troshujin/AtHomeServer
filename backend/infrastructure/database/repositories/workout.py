from fastapi import Depends
from sqlalchemy.orm import selectinload
from typing import override, Annotated
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.database.models import Workout, WorkoutExercise, WorkoutSet
from infrastructure.database.repositories._base import BaseRepository
from infrastructure.database.session import get_db_session


class WorkoutRepository(BaseRepository[Workout]):
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        super().__init__(Workout, session)

    @override
    def query_options(self, query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
        query = query.options(
            selectinload(Workout.exercises)
            .selectinload(WorkoutExercise.sets)
            .selectinload(WorkoutSet.reps)
        )
        return query
