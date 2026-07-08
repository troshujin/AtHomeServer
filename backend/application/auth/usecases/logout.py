from typing import Annotated

from fastapi import Depends
from fastapi.responses import RedirectResponse

from application.auth.services.identity import IdentityService
from core.common.result import Result, succeed
from core.configuration import config
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.service import RedisSessionService


class AuthLogoutUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        redis_service: Annotated[RedisSessionService, Depends()],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.redis: RedisSessionService = redis_service

    async def __call__(self) -> Result[RedirectResponse]:
        session_id = self.identity_service.request.cookies.get("session_id")

        if session_id:
            await self.redis.delete(AuthCacheKeyGenerator.session(session_id))

        response = RedirectResponse(url=config.auth.FRONTEND_URL, status_code=303)
        response.delete_cookie(key="session_id", secure=True, samesite="lax")

        return succeed(response)
