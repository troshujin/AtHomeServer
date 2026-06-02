from pydantic import BaseModel

from infrastructure.trojonetworks.dtos.auth import TokensDto
from infrastructure.trojonetworks.dtos.user import UserProxyDto
from infrastructure.trojonetworks.permission import NetworkPermissionsCollectionDto


class RedisSessionDto(BaseModel):
    tokens: TokensDto
    permissions: list[NetworkPermissionsCollectionDto] = []
    profile: UserProxyDto | None = None


class RedisLoginSessionDto(BaseModel):
    target_url: str
    pkce_code_verifier: str
