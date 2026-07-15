from typing import Annotated

from fastapi import Depends
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.models import ProfileCardStat
from infrastructure.database.repositories._base import BaseRepository
from infrastructure.database.session import get_db_session


class ProfileCardStatRepository(BaseRepository[ProfileCardStat]):
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        super().__init__(ProfileCardStat, session)

    async def get_for_user(self, user_id: str) -> list[ProfileCardStat]:
        query = (
            select(ProfileCardStat)
            .where(ProfileCardStat.user_id == user_id)
            .order_by(ProfileCardStat.position)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def replace_for_user(self, user_id: str, stat_keys: list[str]) -> list[ProfileCardStat]:
        """
        The selection is tiny (max a handful of rows) and always saved as a
        whole ordered list - delete-and-reinsert in one transaction is
        simpler and just as correct as diffing rows.
        """
        _ = await self.session.execute(
            delete(ProfileCardStat).where(ProfileCardStat.user_id == user_id)
        )

        models = [
            ProfileCardStat(user_id=user_id, stat_key=stat_key, position=position)
            for position, stat_key in enumerate(stat_keys)
        ]
        self.session.add_all(models)
        await self.session.commit()

        return await self.get_for_user(user_id)
