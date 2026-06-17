from datetime import datetime
from uuid import UUID
from pydantic.alias_generators import to_camel
from typing import ClassVar
from pydantic import BaseModel, ConfigDict


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
    skip: int = 0
    limit: int = 0
