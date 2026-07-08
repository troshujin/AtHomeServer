from fastapi import Request
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisSessionDto
from infrastructure.cache.redis.service import RedisSessionService

import application.auth.utils as auth_utils


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

        user_session = RedisSessionDto.model_validate_json(session)

        is_expired = auth_utils.is_token_expired(user_session.tokens.refresh_token)
        if is_expired:
            await self.redis.delete(session_key)
            return None

        return user_session
