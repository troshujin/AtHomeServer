from datetime import datetime
from uuid import UUID
from pydantic.alias_generators import to_camel
from typing import ClassVar, Generic, TypeVar
from pydantic import BaseModel, ConfigDict, Field


class APIBaseModel(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class BaseEntity(APIBaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime


class BaseSearchQuery(BaseModel):
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)


T = TypeVar("T")


class Page(APIBaseModel, Generic[T]):
    items: list[T]
    total: int
    skip: int
    limit: int
