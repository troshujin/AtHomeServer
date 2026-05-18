from pydantic import BaseModel

from web.trojonetworks.dtos.auth import TokensDto
from web.trojonetworks.dtos.user import UserProxyDto
from web.trojonetworks.permission import NetworkPermissionsCollectionDto


class RedisSessionDto(BaseModel):
    tokens: TokensDto
    permissions: list[NetworkPermissionsCollectionDto] = []
    profile: UserProxyDto | None = None


class RedisLoginSessionDto(BaseModel):
    target_url: str
    pkce_code_verifier: str
