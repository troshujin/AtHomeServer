from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from fastapi import Depends

from application.auth.services.identity import IdentityService
from application.gym.dto import MutateWorkoutDto, WorkoutDto
from core.common.result import Result, succeed
from infrastructure.database.models import (
    Workout,
    WorkoutExercise,
    WorkoutRep,
    WorkoutSet,
)
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class CreateWorkoutUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)

    async def __call__(self, new_workout_dto: MutateWorkoutDto) -> Result[WorkoutDto]:
        self.identity_service.get_current_user()

        new_workout = Workout(
            **new_workout_dto.model_dump(exclude={"exercises"}),
            exercises=[
                WorkoutExercise(
                    **exercise_dto.model_dump(exclude={"sets"}),
                    sets=[
                        WorkoutSet(
                            **set_dto.model_dump(exclude={"reps"}),
                            reps=[
                                WorkoutRep(
                                    **rep_dto.model_dump(),
                                )
                                for rep_dto in set_dto.reps
                            ],
                        )
                        for set_dto in exercise_dto.sets
                    ],
                )
                for exercise_dto in new_workout_dto.exercises
            ],
        )

        workout = await self.repo.create(new_workout)
        workout_dto = WorkoutDto.model_validate(workout)

        return succeed(workout_dto)
