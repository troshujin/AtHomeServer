from pydantic import BaseModel


class ShortPermissionDto(BaseModel):
    id: str
    name: str


class NetworkPermissionsCollectionDto(BaseModel):
    id: str
    name: str
    permissions: list[ShortPermissionDto]
