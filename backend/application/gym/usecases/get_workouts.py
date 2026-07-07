from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from fastapi import Depends

from application.auth.services.identity import IdentityService
from application.gym.dto import FetchWorkoutFilters, WorkoutDto
from core.common.result import Result, fail, succeed
from core.common.schema import Page
from core.exceptions.base import CustomException
from infrastructure.database.models import Workout
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class GetWorkoutsUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    def build_query_modifier(self, filters: FetchWorkoutFilters, user_id: str):
        def modifier(query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
            query = query.where(Workout.user_id == user_id)

            if filters.finished is True:
                query = query.where(Workout.ended_at.is_not(None))
            elif filters.finished is False:
                query = query.where(Workout.ended_at.is_(None))

            return query.order_by(Workout.started_at.desc())

        return modifier

    async def __call__(self, filters: FetchWorkoutFilters) -> Result[Page[WorkoutDto]]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        user = user_session.profile

        modifier = self.build_query_modifier(filters, user.id)
        workouts, total = await self.repo.get_page(
            skip=filters.skip, limit=filters.limit, modifier=modifier
        )

        workout_dtos = [WorkoutDto.model_validate(workout) for workout in workouts]

        return succeed(
            Page(items=workout_dtos, total=total, skip=filters.skip, limit=filters.limit)
        )
