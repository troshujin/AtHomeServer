import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.profile.dto import MutateCardPrivacyDto, ProfileCardStatsDto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.profile_card_stat import ProfileCardStatRepository
from infrastructure.database.repositories.user import UserRepository
from infrastructure.database.session import get_db_session


class SetCardPrivacyUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.user_repo: UserRepository = UserRepository(session=session)
        self.card_repo: ProfileCardStatRepository = ProfileCardStatRepository(session=session)

    async def __call__(self, payload: MutateCardPrivacyDto) -> Result[ProfileCardStatsDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        user = await self.user_repo.get_by_id(me_id)
        if not user:
            return fail(NotFoundException())

        await self.user_repo.update_by_id(me_id, {"card_is_private": payload.is_private})

        selected = await self.card_repo.get_for_user(user_session.profile.id)

        return succeed(
            ProfileCardStatsDto(
                stat_keys=[stat.stat_key for stat in selected],
                is_private=payload.is_private,
            )
        )
