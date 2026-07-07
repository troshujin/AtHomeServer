"""
Base repository to contain CRUD logic
"""

from typing import TypeVar, Generic
import uuid
from collections.abc import Sequence, Callable
from sqlalchemy import select, update, delete, func, Select
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

    async def get_page(
        self,
        skip: int,
        limit: int,
        modifier: Callable[[Select[tuple[Model]]], Select[tuple[Model]]] | None = None,
    ) -> tuple[Sequence[Model], int]:
        base_query = select(self.model)

        if modifier:
            base_query = modifier(base_query)

        # Ordering is irrelevant to (and, wrapped in a bare subquery,
        # sometimes rejected by) a COUNT - modifier() may have added one
        # for the actual page query, so strip it here.
        total = await self.session.scalar(
            select(func.count()).select_from(base_query.order_by(None).subquery())
        )

        query = self.query_options(base_query).offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()

        return items, total or 0

    async def get_by_id(self, model_id: uuid.UUID) -> Model | None:
        query = select(self.model).where(self.model.id == model_id)
        query = self.query_options(query)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, model: Model) -> Model:
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return model

    async def upsert(self, model: Model) -> Model:
        merged = await self.session.merge(model)
        await self.session.commit()
        await self.session.refresh(merged)
        return merged

    async def update_by_id(
        self,
        model_id: uuid.UUID,
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
        model_id: uuid.UUID,
    ) -> None:
        query = delete(self.model).where(self.model.id == model_id)
        _ = await self.session.execute(query)
        await self.session.commit()

    async def delete(self, model: Model) -> None:
        await self.session.delete(model)
        await self.session.commit()
