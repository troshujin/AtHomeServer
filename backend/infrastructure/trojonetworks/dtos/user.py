from datetime import datetime
from typing import ClassVar

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class UserProxyDto(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    id: str
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    is_default: bool
    has_password: bool
    created_on: datetime
