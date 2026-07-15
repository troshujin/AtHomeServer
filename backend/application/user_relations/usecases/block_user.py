import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.user_relations.dto import BlockedUserDto, to_blocked_dto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.models import BlockedUser
from infrastructure.database.repositories.blocked_user import BlockedUserRepository
from infrastructure.database.repositories.user import UserRepository
from infrastructure.database.repositories.user_relation import UserRelationRepository
from infrastructure.database.session import get_db_session


class BlockUserUseCase:
    """Blocking also severs any existing relation (friendship or pending
    request, either direction) - a block that left the friendship standing
    would be an empty gesture."""

    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.blocked_repo: BlockedUserRepository = BlockedUserRepository(session=session)
        self.relation_repo: UserRelationRepository = UserRelationRepository(session=session)
        self.user_repo: UserRepository = UserRepository(session=session)

    async def __call__(self, target_user_id: uuid.UUID) -> Result[BlockedUserDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        if me_id == target_user_id:
            return fail(CustomException("You can't block yourself", http_code=400))

        target = await self.user_repo.get_by_id(target_user_id)
        if not target:
            return fail(NotFoundException("This user doesn't exist"))

        existing = await self.blocked_repo.get_block(me_id, target_user_id)
        if existing:
            return succeed(to_blocked_dto(existing))

        relation = await self.relation_repo.get_for_pair(me_id, target_user_id)
        if relation:
            await self.relation_repo.delete(relation)

        block = await self.blocked_repo.create(
            BlockedUser(user_id=me_id, target_user_id=target_user_id)
        )

        refreshed = await self.blocked_repo.get_by_id(block.id)
        if not refreshed:
            return fail(CustomException("Block not found after creation"))

        return succeed(to_blocked_dto(refreshed))
