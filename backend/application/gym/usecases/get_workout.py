import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.gym.dto import WorkoutDto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class GetWorkoutUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    async def __call__(self, workout_id: uuid.UUID) -> Result[WorkoutDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        user = user_session.profile

        workout = await self.repo.get_by_id(workout_id)

        if not workout:
            return fail(NotFoundException("Workout not found."))

        is_owner = str(workout.user_id) == user.id
        is_finished = workout.ended_at is not None

        # Anyone can view a finished workout - that's what the promoted
        # feed is. An in-progress one stays private to its owner.
        if not is_owner and not is_finished:
            return fail(NotFoundException("Workout not found."))

        return succeed(WorkoutDto.model_validate(workout))
