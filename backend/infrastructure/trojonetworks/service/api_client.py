import httpx

from core.configuration import config
from infrastructure.trojonetworks.dtos.auth import TokenRequestDto


class TrojoNetworksClient:
    api: httpx.AsyncClient

    def __init__(self) -> None:
        self.api = httpx.AsyncClient(
            base_url=config.auth.LOGIN_API_URL,
            verify=config.env.APP_ENV != "dev",
        )

    async def request_token(self, payload: TokenRequestDto) -> httpx.Response:
        response = await self.api.post(
            "/auth/token",
            json=payload.model_dump(by_alias=True),
            headers={"Host": "localhost"}
        )

        return response

    async def refresh_token(self, refresh_token: str):
        # Should send refresh token as cookie
        response = await self.api.post(
            f"{config.auth.LOGIN_API_URL}/auth/refresh",
            json={"refreshToken": refresh_token},
            headers={"Host": "localhost"}
        )

        return response
