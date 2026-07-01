import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.gym.dto import MutateWorkoutDto, WorkoutDto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.models import WorkoutExercise, WorkoutRep, WorkoutSet
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class UpdateWorkoutUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    async def __call__(
        self, workout_id: uuid.UUID, updated_workout_dto: MutateWorkoutDto
    ) -> Result[WorkoutDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        user = user_session.profile

        workout = await self.repo.get_by_id(workout_id)

        if not workout or str(workout.user_id) != user.id:
            return fail(NotFoundException("Workout not found."))

        workout.name = updated_workout_dto.name
        workout.started_at = updated_workout_dto.started_at
        workout.ended_at = updated_workout_dto.ended_at
        workout.exercises = [
            WorkoutExercise(
                **exercise_dto.model_dump(exclude={"sets"}),
                sets=[
                    WorkoutSet(
                        **set_dto.model_dump(exclude={"reps"}),
                        reps=[
                            WorkoutRep(**rep_dto.model_dump())
                            for rep_dto in set_dto.reps
                        ],
                    )
                    for set_dto in exercise_dto.sets
                ],
            )
            for exercise_dto in updated_workout_dto.exercises
        ]

        await self.repo.save()

        refreshed = await self.repo.get_by_id(workout_id)

        if not refreshed:
            return fail(NotFoundException("Workout not found."))

        return succeed(WorkoutDto.model_validate(refreshed))
