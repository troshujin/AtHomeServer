from fastapi import Request
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisSessionDto
from infrastructure.cache.redis.service import RedisSessionService


class IdentityService:
    def __init__(self, request: Request):
        self.request: Request = request
        self.redis: RedisSessionService = RedisSessionService()

    async def get_current_user_session(self) -> RedisSessionDto | None:
        session_id = self.request.cookies.get("session_id")

        if not session_id:
            return None

        session_key = AuthCacheKeyGenerator.session(session_id)
        session = await self.redis.get(session_key)

        if not session:
            return None

        result = RedisSessionDto.model_validate_json(session)
        return result
