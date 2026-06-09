from pydantic.alias_generators import to_camel
from typing import ClassVar
from pydantic import BaseModel, ConfigDict


class APIBaseModel(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        alias_generator=to_camel, populate_by_name=True
    )


class BaseSearchQuery(BaseModel):
    skip: int
    limit: int
