from fastapi import Depends
from typing import Annotated

from application.auth.usecases.refresh_user_session import RefreshUserSessionUseCase
import application.auth.utils as auth_utils
from core.common.result import Result, fail, succeed
from core.exceptions.standard import UnauthenticatedException
from infrastructure.cache.redis.dto import RedisSessionDto


class ValidateUserSessionUseCase:
    def __init__(
        self,
        refresh_user_session: Annotated[RefreshUserSessionUseCase, Depends()],
    ) -> None:
        self.refresh_user_session: RefreshUserSessionUseCase = refresh_user_session

    async def __call__(
        self,
        user_session: RedisSessionDto,
    ) -> Result[RedisSessionDto]:
        access_valid = auth_utils.is_token_expired(user_session.tokens.access_token)
        refresh_valid = auth_utils.is_token_expired(user_session.tokens.refresh_token)

        if access_valid:
            return succeed(user_session)

        if refresh_valid:
            user_session_result = await self.refresh_user_session(
                user_session=user_session
            )
            return user_session_result

        return fail(UnauthenticatedException())
