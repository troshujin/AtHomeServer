"""
Base repository to contain CRUD logic
"""

from typing import TypeVar, Generic
from collections.abc import Sequence, Callable
from sqlalchemy import select, update, delete, Select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.models import Base

Model = TypeVar("Model", bound=Base)


class BaseRepository(Generic[Model]):
    def __init__(self, model: type[Model], session: AsyncSession):
        self.model: type[Model] = model
        self.session: AsyncSession = session

    def query_options(self, query: Select[tuple[Model]]) -> Select[tuple[Model]]:
        return query

    async def get(
        self, 
        modifier: Callable[[Select[tuple[Model]]], Select[tuple[Model]]] | None = None
    ) -> Sequence[Model]:
        query = select(self.model)
        
        if modifier:
            query = modifier(query)

        query = self.query_options(query)
            
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, model_id: int) -> Model | None:
        query = select(self.model).where(self.model.id == model_id)
        query = self.query_options(query)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, model: Model) -> Model:
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return model

    async def update_by_id(
        self,
        model_id: int,
        params: dict[str, object],
    ) -> None:
        query = update(self.model).where(self.model.id == model_id).values(**params)
        _ = await self.session.execute(query)
        await self.session.commit()

    async def refresh(self, model: Model) -> Model:
        await self.session.refresh(model)
        return model

    async def save(self) -> None:
        await self.session.commit()

    async def delete_by_id(
        self,
        model_id: int,
    ) -> None:
        query = delete(self.model).where(self.model.id == model_id)
        _ = await self.session.execute(query)
        await self.session.commit()
