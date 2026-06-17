from uuid import UUID
from pydantic import BaseModel


class ShortPermissionDto(BaseModel):
    id: UUID
    name: str


class NetworkPermissionsDto(BaseModel):
    id: UUID
    name: str
    permissions: list[ShortPermissionDto]
