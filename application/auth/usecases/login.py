import base64
import secrets
from urllib.parse import urlencode

import application.auth.utils as auth_utils
from application.auth.dto import AuthLoginDto, AuthLoginResultDto
from application.redis.dto import RedisLoginSessionDto
from application.redis.service import RedisSessionService
from core.configuration import config
from web.trojonetworks.dtos.auth import AuthorizationRequestDto


class AuthLoginUseCase:
    def __init__(self) -> None:
        self.redis: RedisSessionService = RedisSessionService()

    async def __call__(self, payload: AuthLoginDto) -> AuthLoginResultDto:
        session_id = secrets.token_urlsafe(32)

        code_verifier = auth_utils.generate_code_verifier()
        code_challenge = auth_utils.generate_code_challenge(code_verifier)
        target_url = payload.redirect_url or config.auth.FRONTEND_URL

        await self.redis.save_login_session(
            session_id,
            RedisLoginSessionDto(
                target_url=target_url,
                pkce_code_verifier=code_verifier,
            ),
            config.auth.LOGIN_EXPIRATION_SECONDS,
        )

        back = (
            base64.urlsafe_b64encode(
                f"{config.auth.FRONTEND_URL}{config.auth.BACK_PATH}".encode()
            )
            .decode()
            .rstrip("=")
        )

        params_dto = AuthorizationRequestDto(
            client_id=config.auth.CLIENT_ID,
            code_challenge=code_challenge,
            state=session_id,
            back=back,
        )

        params = params_dto.model_dump(by_alias=True)
        auth_url = f"{config.auth.LOGIN_BASE_URL}/networks/{config.auth.NETWORK_ID}/login?{urlencode(params)}"

        result = AuthLoginResultDto(
            redirect_url=auth_url,
        )

        return result
