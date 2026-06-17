from fastapi import Depends
from typing import cast, Annotated

from fastapi.responses import RedirectResponse
from pydantic import ValidationError

from application.auth.usecases.refresh_user_session import RefreshUserSessionUseCase
import application.auth.utils as auth_utils
from application.auth.dto import AuthCallbackDto
from core.common.result import Failure, Result, fail, succeed
from core.configuration import config
from core.exceptions.base import CustomException
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisLoginSessionDto, RedisSessionDto
from infrastructure.cache.redis.service import RedisSessionService
from infrastructure.trojonetworks.dtos.auth import TokenRequestDto, TokensDto
from infrastructure.trojonetworks.service.api_client import TrojoNetworksClient


class AuthCallbackUseCase:
    def __init__(
        self,
        refresh_user_session_use_case: Annotated[RefreshUserSessionUseCase, Depends()],
    ) -> None:
        self.redis: RedisSessionService = RedisSessionService()
        self.api_client: TrojoNetworksClient = TrojoNetworksClient()
        self.refresh_user_session_use_case: RefreshUserSessionUseCase = (
            refresh_user_session_use_case
        )

    async def __call__(self, payload: AuthCallbackDto) -> Result[RedirectResponse]:
        token_key = payload.state
        login_process_key = AuthCacheKeyGenerator.login_process(token_key)
        login_session_raw = await self.redis.get(login_process_key)

        if not login_session_raw:
            return fail(CustomException("Invalid state or missing code"))

        try:
            login_session = RedisLoginSessionDto.model_validate_json(login_session_raw)
        except ValidationError:
            return fail(CustomException("Invalid state or missing code"))

        if not login_session or not payload.code:
            return fail(CustomException("Invalid state or missing code"))

        if not login_session.pkce_code_verifier:
            return fail(CustomException("Invalid state or missing code"))

        payload_dto = TokenRequestDto(
            code=payload.code,
            client_id=config.auth.CLIENT_ID,
            code_verifier=login_session.pkce_code_verifier,
        )

        response = await self.api_client.request_token(payload_dto)

        if response.status_code != 200:
            return fail(CustomException("Failed to exchange code for tokens."))

        await self.redis.delete(login_process_key)

        token_data = cast(dict[str, str], response.json())
        refresh_cookie = response.cookies.get("refreshToken")

        if not refresh_cookie:
            return fail(CustomException("Refresh token was not provided"))

        token_data["refreshToken"] = refresh_cookie

        try:
            tokens = TokensDto.model_validate(token_data)
        except ValidationError:
            return fail(
                CustomException("Response from authentication server was invalid")
            )

        user_session_id = AuthCacheKeyGenerator.new_id()
        rt_data = auth_utils.decode_refresh_jwt(tokens.refresh_token)

        user_session = RedisSessionDto(
            id=user_session_id,
            tokens=tokens
        )

        user_info = await self.refresh_user_session_use_case(user_session=user_session)

        if isinstance(user_info, Failure):
            return fail(user_info.error)

        result = RedirectResponse(url=login_session.target_url, status_code=303)

        result.set_cookie(
            key="session_id",
            value=user_session_id,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=rt_data.exp,
        )

        return succeed(result)
