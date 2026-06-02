import base64
from urllib.parse import urlencode

from starlette.responses import RedirectResponse

import application.auth.utils as auth_utils
from application.auth.dto import AuthLoginDto
from core.common.result import Result, succeed
from core.configuration import config
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisLoginSessionDto
from infrastructure.cache.redis.service import RedisSessionService
from infrastructure.trojonetworks.dtos.auth import AuthorizationRequestDto


class AuthLoginUseCase:
    def __init__(self) -> None:
        self.redis: RedisSessionService = RedisSessionService()

    async def __call__(self, payload: AuthLoginDto) -> Result[RedirectResponse]:
        token_key = AuthCacheKeyGenerator.rdn_key()
        login_process_key = AuthCacheKeyGenerator.login_process(token_key)

        code_verifier = auth_utils.generate_code_verifier()
        code_challenge = auth_utils.generate_code_challenge(code_verifier)
        target_url = payload.redirect_url or config.auth.FRONTEND_URL

        state = RedisLoginSessionDto(
            target_url=target_url,
            pkce_code_verifier=code_verifier,
        )

        await self.redis.set(
            login_process_key,
            state.model_dump_json(),
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
            state=token_key,
            back=back,
        )

        params = params_dto.model_dump(by_alias=True)
        auth_url = f"{config.auth.LOGIN_BASE_URL}/networks/{config.auth.NETWORK_ID}/login?{urlencode(params)}"

        result = RedirectResponse(
            url=auth_url,
        )

        return succeed(result)
