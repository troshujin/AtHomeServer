from typing import Any

import application.auth.utils as auth_utils
from application.auth.dto import AuthCallbackDto, AuthLoginDto
from application.auth.usecases.callback import handle_callback
from application.auth.usecases.login import handle_login
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
            response = await self.api_client
            _ = response.raise_for_status()
            data = TokensDto.model_validate(response.json())

            self._save_tokens(data.access_token, data.refresh_token)
        except Exception as err:
            print(f"Failed to refresh tokens: {err}")
            self.clear_tokens()

    async def login(self, redirect_url: str | None = None) -> str:
        return await handle_login(AuthLoginDto(redirect_url=redirect_url))

    async def callback(self, code: str, state: str) -> str:
        return await handle_callback(self, AuthCallbackDto(code=code, state=state))

    async def get_current_user(self) -> dict[str, Any]:
        if self.user_proxy:
            return self.user_proxy

        headers = await self.apply_headers({})
        response = await self.api.get("/me", headers=headers)
        _ = response.raise_for_status()

        self.user_proxy = response.json()
        return self.user_proxy

    def logout(self):
        self.clear_tokens()
        return "/"

    def _save_tokens(self, a_token: str, r_token: str):
        self.local_storage[self.access_token_key] = a_token
        self.local_storage[self.refresh_token_key] = r_token

    def clear_tokens(self):
        _ = self.local_storage.pop(self.access_token_key, None)
        _ = self.local_storage.pop(self.refresh_token_key, None)
        self.user_proxy = None
