from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from fastapi import Depends

from application.auth.services.identity import IdentityService
from application.gym.dto import FetchWorkoutFilters, WorkoutDto
from core.common.result import Result, succeed
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

    def build_query_modifier(self, _: FetchWorkoutFilters):
        def modifier(query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
            return query

        return modifier

    async def __call__(self, filters: FetchWorkoutFilters) -> Result[list[WorkoutDto]]:
        # self.identity_service.get_current_user_session()

        modifier = self.build_query_modifier(filters)
        workouts = await self.repo.get(modifier=modifier)

        workouts_dtos = [WorkoutDto.model_validate(workout) for workout in workouts]

        return succeed(workouts_dtos)
