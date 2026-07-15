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
from infrastructure.database.repositories.user_relation import UserRelationRepository
from infrastructure.database.session import get_db_session


class AcceptRelationUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: UserRelationRepository = UserRelationRepository(session=session)

    async def __call__(self, relation_id: uuid.UUID) -> Result[UserRelationDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        relation = await self.repo.get_by_id(relation_id)

        # A relation someone else is part of is indistinguishable from a
        # missing one on purpose - relation ids shouldn't be probeable.
        if not relation or me_id not in (relation.user_id_one, relation.user_id_two):
            return fail(NotFoundException())

        if relation.status != UserRelationStatus.REQUESTED:
            return fail(CustomException("This request was already accepted", http_code=400))

        if relation.requested_by_id == me_id:
            return fail(
                CustomException("You can't accept a request you sent yourself", http_code=400)
            )

        relation.status = UserRelationStatus.ACCEPTED
        await self.repo.save()

        return succeed(to_relation_dto(relation, me_id))
