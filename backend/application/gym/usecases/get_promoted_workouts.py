from typing import Annotated

from fastapi import Depends
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

from application.gym.dto import WorkoutDto
from core.common.result import Result, succeed
from core.common.schema import BaseSearchQuery, Page
from infrastructure.database.models import Workout
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class GetPromotedWorkoutsUseCase:
    """The most recent finished workouts, network-wide. There's no
    friends/follow model yet, so "promoted" is simply recency - the
    simplest possible ranking for a public activity feed.
    """

    def __init__(
        self,
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    def build_query_modifier(self):
        def modifier(query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
            return query.where(Workout.ended_at.is_not(None)).order_by(
                Workout.ended_at.desc()
            )

        return modifier

    async def __call__(self, filters: BaseSearchQuery) -> Result[Page[WorkoutDto]]:
        modifier = self.build_query_modifier()
        workouts, total = await self.repo.get_page(
            skip=filters.skip, limit=filters.limit, modifier=modifier
        )

        workout_dtos = [WorkoutDto.model_validate(workout) for workout in workouts]

        return succeed(
            Page(items=workout_dtos, total=total, skip=filters.skip, limit=filters.limit)
        )
