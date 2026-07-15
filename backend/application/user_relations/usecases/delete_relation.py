import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.repositories.user_relation import UserRelationRepository
from infrastructure.database.session import get_db_session


class DeleteRelationUseCase:
    """One deletion covers all three removal flavors - ignoring an incoming
    request, cancelling an outgoing one, and unfriending - they only differ
    in what the frontend calls them."""

    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.repo: UserRelationRepository = UserRelationRepository(session=session)

    async def __call__(self, relation_id: uuid.UUID) -> Result[None]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        relation = await self.repo.get_by_id(relation_id)

        if not relation or me_id not in (relation.user_id_one, relation.user_id_two):
            return fail(NotFoundException())

        await self.repo.delete(relation)

        return succeed(None)
