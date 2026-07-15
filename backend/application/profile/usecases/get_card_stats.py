from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.profile.dto import ProfileCardStatsDto
import uuid

from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from infrastructure.database.repositories.profile_card_stat import ProfileCardStatRepository
from infrastructure.database.repositories.user import UserRepository
from infrastructure.database.session import get_db_session


class GetCardStatsUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: ProfileCardStatRepository = ProfileCardStatRepository(session=session)
        self.user_repo: UserRepository = UserRepository(session=session)

    async def __call__(self) -> Result[ProfileCardStatsDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        selected = await self.repo.get_for_user(user_session.profile.id)

        user = await self.user_repo.get_by_id(uuid.UUID(user_session.profile.id))

        return succeed(
            ProfileCardStatsDto(
                stat_keys=[stat.stat_key for stat in selected],
                is_private=user.card_is_private if user else False,
            )
        )
