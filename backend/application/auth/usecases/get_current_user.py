from pydantic import ValidationError
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from fastapi import Depends

from application.auth.services.identity import IdentityService
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session
from infrastructure.trojonetworks.dtos.user import UserProxyDto
from infrastructure.trojonetworks.service.api_client import TrojoNetworksClient


class GetCurrentUserUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: WorkoutRepository = WorkoutRepository(session=session)
        self.api_client: TrojoNetworksClient = TrojoNetworksClient()

    async def __call__(self) -> Result[UserProxyDto]:
        try:
            user_session = await self.identity_service.get_current_user_session()
        except ValidationError as exc:
            print(exc)
            return fail(CustomException("Stored session is corrupt"))

        if not user_session:
            return fail(NotFoundException())

        dto = UserProxyDto(
            id="str",
            username="str",
            email="str",
            first_name="str",
            created_on=datetime.datetime(2026, 7, 29, 5, 14, 3),
            is_default=True,
            has_password=True,
        )

        return succeed(dto)
