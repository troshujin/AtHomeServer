import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.models import UserRelation
from infrastructure.database.repositories._base import BaseRepository
from infrastructure.database.session import get_db_session


def canonical_pair(user_id_a: uuid.UUID, user_id_b: uuid.UUID) -> tuple[uuid.UUID, uuid.UUID]:
    """The storage order for a user pair: smaller UUID first (see the model's
    ck_user_relation_pair_order constraint)."""
    return (user_id_a, user_id_b) if user_id_a < user_id_b else (user_id_b, user_id_a)


class UserRelationRepository(BaseRepository[UserRelation]):
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        super().__init__(UserRelation, session)

    async def get_for_user(self, user_id: uuid.UUID) -> list[UserRelation]:
        query = (
            select(UserRelation)
            .where(
                or_(
                    UserRelation.user_id_one == user_id,
                    UserRelation.user_id_two == user_id,
                )
            )
            .order_by(UserRelation.created_at.desc())
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_for_pair(
        self, user_id_a: uuid.UUID, user_id_b: uuid.UUID
    ) -> UserRelation | None:
        one, two = canonical_pair(user_id_a, user_id_b)
        query = select(UserRelation).where(
            UserRelation.user_id_one == one,
            UserRelation.user_id_two == two,
        )
        result = await self.session.execute(query)
        return result.scalars().first()
