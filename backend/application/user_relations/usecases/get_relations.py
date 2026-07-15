import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.user_relations.dto import UserRelationsDto, to_relation_dto
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from domain.constants.user_relation import UserRelationStatus
from infrastructure.database.repositories.user_relation import UserRelationRepository
from infrastructure.database.session import get_db_session


class GetRelationsUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: UserRelationRepository = UserRelationRepository(session=session)

    async def __call__(self) -> Result[UserRelationsDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        relations = await self.repo.get_for_user(me_id)

        dto = UserRelationsDto(friends=[], incoming=[], outgoing=[])

        for relation in relations:
            entry = to_relation_dto(relation, me_id)

            if relation.status == UserRelationStatus.ACCEPTED:
                dto.friends.append(entry)
            elif relation.requested_by_id == me_id:
                dto.outgoing.append(entry)
            else:
                dto.incoming.append(entry)

        return succeed(dto)
