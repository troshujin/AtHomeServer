import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.user_relations.dto import UserRelationDto, to_relation_dto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from domain.constants.user_relation import UserRelationStatus
from infrastructure.database.models import UserRelation
from infrastructure.database.repositories.blocked_user import BlockedUserRepository
from infrastructure.database.repositories.user import UserRepository
from infrastructure.database.repositories.user_relation import (
    UserRelationRepository,
    canonical_pair,
)
from infrastructure.database.session import get_db_session


class RequestFriendUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.relation_repo: UserRelationRepository = UserRelationRepository(session=session)
        self.blocked_repo: BlockedUserRepository = BlockedUserRepository(session=session)
        self.user_repo: UserRepository = UserRepository(session=session)

    async def __call__(self, target_user_id: uuid.UUID) -> Result[UserRelationDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        if me_id == target_user_id:
            return fail(CustomException("You can't add yourself", http_code=400))

        target = await self.user_repo.get_by_id(target_user_id)
        if not target:
            return fail(NotFoundException("This user doesn't exist"))

        # Deliberately the same message in both directions - a block should
        # not be discoverable by probing friend requests.
        if await self.blocked_repo.exists_between(me_id, target_user_id):
            return fail(CustomException("You can't add this user", http_code=400))

        existing = await self.relation_repo.get_for_pair(me_id, target_user_id)
        if existing:
            message = (
                "You're already friends"
                if existing.status == UserRelationStatus.ACCEPTED
                else "There's already a pending request between you"
            )
            return fail(CustomException(message, http_code=400))

        one, two = canonical_pair(me_id, target_user_id)
        relation = await self.relation_repo.create(
            UserRelation(
                status=UserRelationStatus.REQUESTED,
                user_id_one=one,
                user_id_two=two,
                requested_by_id=me_id,
            )
        )

        # Re-fetch through the query path so the user_one/user_two
        # relationships are loaded for the DTO (same reasoning as
        # create_workout.py's re-fetch).
        refreshed = await self.relation_repo.get_by_id(relation.id)
        if not refreshed:
            return fail(CustomException("Relation not found after creation"))

        return succeed(to_relation_dto(refreshed, me_id))
