from pydantic import BaseModel

from infrastructure.trojonetworks.dtos.auth import TokensDto
from infrastructure.trojonetworks.dtos.permission import ShortPermissionDto
from infrastructure.trojonetworks.dtos.user import UserProxyDto


class RedisSessionDto(BaseModel):
    id: str
    tokens: TokensDto
    permissions: list[ShortPermissionDto] = []
    profile: UserProxyDto | None = None


class RedisLoginSessionDto(BaseModel):
    target_url: str
    pkce_code_verifier: str
