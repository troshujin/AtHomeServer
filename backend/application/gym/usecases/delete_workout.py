import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class DeleteWorkoutUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    async def __call__(self, workout_id: uuid.UUID) -> Result[None]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        user = user_session.profile

        workout = await self.repo.get_by_id(workout_id)

        if not workout or str(workout.user_id) != user.id:
            return fail(NotFoundException("Workout not found."))

        await self.repo.delete(workout)

        return succeed(None)
