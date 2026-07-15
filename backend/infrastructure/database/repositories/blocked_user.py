import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.models import BlockedUser
from infrastructure.database.repositories._base import BaseRepository
from infrastructure.database.session import get_db_session


class BlockedUserRepository(BaseRepository[BlockedUser]):
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        super().__init__(BlockedUser, session)

    async def get_for_user(self, user_id: uuid.UUID) -> list[BlockedUser]:
        query = (
            select(BlockedUser)
            .where(BlockedUser.user_id == user_id)
            .order_by(BlockedUser.created_at.desc())
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_block(
        self, user_id: uuid.UUID, target_user_id: uuid.UUID
    ) -> BlockedUser | None:
        query = select(BlockedUser).where(
            BlockedUser.user_id == user_id,
            BlockedUser.target_user_id == target_user_id,
        )
        result = await self.session.execute(query)
        return result.scalars().first()

    async def exists_between(self, user_id_a: uuid.UUID, user_id_b: uuid.UUID) -> bool:
        """A block in either direction - the two behave the same for
        everything except who can undo it."""
        query = select(BlockedUser.id).where(
            or_(
                (BlockedUser.user_id == user_id_a) & (BlockedUser.target_user_id == user_id_b),
                (BlockedUser.user_id == user_id_b) & (BlockedUser.target_user_id == user_id_a),
            )
        )
        result = await self.session.execute(query)
        return result.scalars().first() is not None
