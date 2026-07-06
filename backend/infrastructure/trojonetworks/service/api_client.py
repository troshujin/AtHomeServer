import httpx

from core.configuration import config
from infrastructure.trojonetworks.dtos.auth import TokenRequestDto


class TrojoNetworksClient:
    api: httpx.AsyncClient

    def __init__(self):
        self.api = httpx.AsyncClient(
            base_url=config.auth.LOGIN_API_URL,
            verify=True,
        )

    async def request_token(self, payload: TokenRequestDto) -> httpx.Response:
        response = await self.api.post(
            "/auth/token",
            json=payload.model_dump(by_alias=True),
        )

        return response

    async def refresh_token(self, refresh_token: str) -> httpx.Response:
        response = await self.api.post(
            f"{config.auth.LOGIN_API_URL}/auth/{config.auth.NETWORK_ID}/refresh",
            cookies={"refreshToken": refresh_token},
        )
        return response

    async def fetch_user(self, access_token: str) -> httpx.Response:
        response = await self.api.get(
            f"{config.auth.LOGIN_API_URL}/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        return response

    async def fetch_user_permissions(self, access_token: str) -> httpx.Response:
        response = await self.api.get(
            f"{config.auth.LOGIN_API_URL}/me/permissions",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        return response
