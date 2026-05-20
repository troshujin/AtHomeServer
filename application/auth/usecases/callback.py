import application.auth.utils as auth_utils
from application.auth.dto import AuthCallbackDto, AuthCallbackResultDto
from application.redis.dto import RedisSessionDto
from application.redis.service import RedisSessionService
from core.configuration import config
from web.trojonetworks.dtos.auth import TokenRequestDto, TokensDto
from web.trojonetworks.service.api_client import TrojoNetworksClient


class AuthCallbackUseCase:
    def __init__(self) -> None:
        self.redis: RedisSessionService = RedisSessionService()
        self.api_client: TrojoNetworksClient = TrojoNetworksClient()

    async def __call__(self, payload: AuthCallbackDto) -> AuthCallbackResultDto:
        session_id = payload.state
        login_session = await self.redis.get_login_session(session_id)

        if not login_session or not payload.code:
            raise ValueError("Invalid state or missing code")

        if not login_session.pkce_code_verifier:
            raise ValueError("Missing code verifier")

        payload_dto = TokenRequestDto(
            code=payload.code,
            client_id=config.auth.CLIENT_ID,
            code_verifier=login_session.pkce_code_verifier,
        )

        response = await self.api_client.request_token(payload_dto)

        if response.status_code != 200:
            raise RuntimeError("Failed to exchange code for tokens.")

        await self.redis.delete_login_session(session_id)

        tokens = TokensDto.model_validate(response.json())
        session_id = self.redis.new_session_id()

        refresh_token = auth_utils.decode_refresh_jwt(tokens.refresh_token)

        await self.redis.save_session(
            session_id,
            RedisSessionDto(tokens=tokens),
            refresh_token.exp,
        )

        result = AuthCallbackResultDto(
            session_id=session_id, redirect_url=login_session.target_url
        )

        return result
