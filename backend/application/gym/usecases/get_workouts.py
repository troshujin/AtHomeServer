from typing import Annotated
from fastapi import Depends
from application.auth.services.identity import IdentityService
from application.gym.dto import FetchWorkoutFilters
from core.common.result import Result, succeed


class GetWorkoutsUseCase:
    def __init__(self, identity_service: Annotated[IdentityService, Depends()]) -> None:
        self.identity_service: IdentityService = identity_service

    async def __call__(self, filters: FetchWorkoutFilters) -> Result[str]:
        self.identity_service.get_current_user()
        return succeed("hello")
