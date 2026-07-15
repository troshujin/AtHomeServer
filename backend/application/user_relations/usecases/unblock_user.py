import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.blocked_user import BlockedUserRepository
from infrastructure.database.session import get_db_session


class UnblockUserUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: BlockedUserRepository = BlockedUserRepository(session=session)

    async def __call__(self, target_user_id: uuid.UUID) -> Result[None]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        block = await self.repo.get_block(me_id, target_user_id)
        if not block:
            return fail(NotFoundException("You haven't blocked this user"))

        await self.repo.delete(block)

        return succeed(None)
