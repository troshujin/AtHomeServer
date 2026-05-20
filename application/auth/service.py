from typing import Any

import application.auth.utils as auth_utils
from application.auth.dto import (
    AuthCallbackDto,
    AuthCallbackResultDto,
    AuthLoginDto,
    AuthLoginResultDto,
)
from application.auth.usecases.callback import AuthCallbackUseCase
from application.auth.usecases.login import AuthLoginUseCase
from application.redis.dto import RedisSessionDto
from application.redis.service import RedisSessionService
from web.trojonetworks.dtos.auth import TokensDto
from web.trojonetworks.service.api_client import TrojoNetworksClient


class AuthService:
    def __init__(self):
        self.api_client: TrojoNetworksClient = TrojoNetworksClient()
        self.redis: RedisSessionService = RedisSessionService()

    async def token_check(self, session_id: str) -> None:
        user_data = await self.redis.get_session(session_id)

        if not user_data:
            return

        if auth_utils.is_token_expired(user_data.tokens.refresh_token):
            return await self.redis.delete_session(session_id)

        if auth_utils.is_token_expired(user_data.tokens.access_token):
            return await self.refresh_tokens(user_data)

    async def refresh_tokens(self, user_data: RedisSessionDto):
        try:
            response = await self.api_client.refresh_token(
                user_data.tokens.refresh_token
            )
            _ = response.raise_for_status()
            data = TokensDto.model_validate(response.json())

            print("Got the data", data)

        except Exception as err:
            print(f"Failed to refresh tokens: {err}")

    async def login(self, redirect_url: str | None = None) -> AuthLoginResultDto:
        use_case = AuthLoginUseCase()
        return await use_case(AuthLoginDto(redirect_url=redirect_url))

    async def callback(self, code: str, state: str) -> AuthCallbackResultDto:
        use_case = AuthCallbackUseCase()
        return await use_case(AuthCallbackDto(code=code, state=state))
