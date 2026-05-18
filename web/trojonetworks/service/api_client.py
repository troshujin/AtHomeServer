import httpx

from core.configuration import config
from web.trojonetworks.dtos.auth import TokenRequestDto


class TrojoNetworksClient:
    api: httpx.AsyncClient

    def __init__(self) -> None:
        self.api = httpx.AsyncClient(base_url=config.auth.LOGIN_API_URL)

    async def request_token(self, payload: TokenRequestDto) -> httpx.Response:
        response = await self.api.post(
            "/auth/token",
            json=payload.model_dump_json(by_alias=True),
        )

        return response

    async def refresh_token(self, refresh_token: str):
        # Should send refresh token as cookie
        response = await self.api.post(
            f"{config.auth.LOGIN_API_URL}/auth/refresh",
            json={"refreshToken": refresh_token},
        )

        return response
