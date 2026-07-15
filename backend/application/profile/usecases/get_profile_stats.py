from typing import Annotated

from fastapi import Depends
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.profile.dto import ProfileStatDto
from application.profile.services.gym_stats import compute_gym_stats
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from infrastructure.database.models import Workout
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class GetProfileStatsUseCase:
    """
    The full stat catalog for the current user: every stat they *could* pin
    to their profile card, with fresh values. Today that's the gym's stats;
    a future feature merges its own `<feature>.*` dict in below.
    """

    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.workout_repo: WorkoutRepository = WorkoutRepository(session=session)

    async def __call__(self) -> Result[list[ProfileStatDto]]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        user = user_session.profile

        def modifier(query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
            return query.where(Workout.user_id == user.id)

        workouts = await self.workout_repo.get(modifier=modifier)

        stats = compute_gym_stats(workouts)

        return succeed([ProfileStatDto(key=key, value=value) for key, value in stats.items()])
