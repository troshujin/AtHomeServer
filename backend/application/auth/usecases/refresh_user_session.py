from datetime import datetime, timezone
from pydantic import ValidationError
from fastapi import Depends
from typing import Annotated, cast

from application.auth.services.identity import IdentityService
import application.auth.utils as auth_utils
from application.auth.usecases.get_current_user import GetCurrentUserUseCase
from core.common.result import Failure, Result, fail, succeed
from core.configuration import config
from core.exceptions.base import CustomException
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisSessionDto
from infrastructure.cache.redis.service import RedisSessionService
from infrastructure.trojonetworks.dtos.permission import (
    NetworkPermissionsDto,
    ShortPermissionDto,
)
from infrastructure.trojonetworks.dtos.user import UserProxyDto
from infrastructure.trojonetworks.service.api_client import TrojoNetworksClient


class RefreshUserSessionUseCase:
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        get_current_user: Annotated[GetCurrentUserUseCase, Depends()],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.api_client: TrojoNetworksClient = TrojoNetworksClient()
        self.get_current_user: GetCurrentUserUseCase = get_current_user
        self.redis: RedisSessionService = RedisSessionService()

    async def __call__(
        self, *, user_session: RedisSessionDto | None = None
    ) -> Result[RedisSessionDto]:
        if user_session is None:
            user_session = await self.identity_service.get_current_user_session()

        if user_session is None:
            return fail(CustomException("User has no session"))

        user_proxy_result = await self._fetch_user_proxy(user_session)
        user_permissions_result = await self._fetch_user_permissions(user_session)

        result = succeed(user_session)
        result = self._update_user_proxy(result, user_proxy_result)
        result = self._update_user_permissions(result, user_permissions_result)
        result = await self._save_session(result)

        return result

    def _update_user_proxy(
        self,
        user_session: Result[RedisSessionDto],
        user_proxy: Result[UserProxyDto],
    ) -> Result[RedisSessionDto]:
        if isinstance(user_session, Failure):
            return user_session

        if isinstance(user_proxy, Failure):
            return Failure(user_proxy.error)

        def update(session: RedisSessionDto) -> RedisSessionDto:
            session.profile = user_proxy.unwrap()
            return session

        return user_session.map(update)

    def _update_user_permissions(
        self,
        user_session: Result[RedisSessionDto],
        user_permissions: Result[list[ShortPermissionDto]],
    ) -> Result[RedisSessionDto]:
        if isinstance(user_session, Failure):
            return user_session

        if isinstance(user_permissions, Failure):
            return Failure(user_permissions.error)

        def update(session: RedisSessionDto) -> RedisSessionDto:
            session.permissions = user_permissions.unwrap()
            return session

        return user_session.map(update)

    async def _fetch_user_proxy(
        self, user_session: RedisSessionDto
    ) -> Result[UserProxyDto]:
        access_token = user_session.tokens.access_token
        response = await self.api_client.fetch_user(access_token)

        if response.status_code != 200:
            return fail(CustomException("Could not fetch user."))

        try:
            user_proxy = UserProxyDto.model_validate(
                cast(dict[str, str], response.json())
            )
        except ValidationError:
            return fail(
                CustomException("Response from authentication server was invalid")
            )

        return succeed(user_proxy)

    async def _fetch_user_permissions(
        self, user_session: RedisSessionDto
    ) -> Result[list[ShortPermissionDto]]:
        access_token = user_session.tokens.access_token
        response = await self.api_client.fetch_user_permissions(access_token)

        if response.status_code != 200:
            return fail(CustomException("Could not fetch user permissions."))

        raw_list = cast(list[dict[str, str]], response.json())

        try:
            user_network_permissions_list = [
                NetworkPermissionsDto.model_validate(raw) for raw in raw_list
            ]
        except ValidationError:
            return fail(
                CustomException("Response from authentication server was invalid")
            )

        for network in user_network_permissions_list:
            if str(network.id) == config.auth.NETWORK_ID:
                permissions = network.permissions
                break

        else:
            return fail(CustomException("User is not part of network"))

        return succeed(permissions)

    async def _save_session(
        self, user_session: Result[RedisSessionDto]
    ) -> Result[RedisSessionDto]:
        if isinstance(user_session, Failure):
            return user_session

        session = user_session.unwrap()
        rt_data = auth_utils.decode_refresh_jwt(session.tokens.refresh_token)

        session_key = AuthCacheKeyGenerator.session(session.id)

        await self.redis.set(
            session_key,
            session.model_dump_json(),
            rt_data.exp - int(datetime.now(timezone.utc).timestamp()),
        )

        return user_session
