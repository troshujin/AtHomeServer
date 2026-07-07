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
from core.exceptions.standard import UnauthorizedException
from infrastructure.cache.keygen.auth import AuthCacheKeyGenerator
from infrastructure.cache.redis.dto import RedisSessionDto
from infrastructure.cache.redis.service import RedisSessionService
from infrastructure.database.models import User
from infrastructure.database.repositories.user import UserRepository
from infrastructure.trojonetworks.dtos.permission import (
    NetworkPermissionsDto,
    ShortPermissionDto,
)
from infrastructure.trojonetworks.dtos.user import UserProxyDto
from infrastructure.trojonetworks.service.api_client import TrojoNetworksClient


class RefreshUserSessionUseCase:
    def __init__(
        self,
        api_client: Annotated[TrojoNetworksClient, Depends()],
        identity_service: Annotated[IdentityService, Depends()],
        redis_service: Annotated[RedisSessionService, Depends()],
        get_current_user: Annotated[GetCurrentUserUseCase, Depends()],
        user_repository: Annotated[UserRepository, Depends()],
    ) -> None:
        self.api_client: TrojoNetworksClient = api_client
        self.redis: RedisSessionService = redis_service
        self.repo: UserRepository = user_repository
        self.get_current_user: GetCurrentUserUseCase = get_current_user
        self.identity_service: IdentityService = identity_service

    async def __call__(
        self, *, user_session: RedisSessionDto | None = None
    ) -> Result[RedisSessionDto]:
        if user_session is None:
            user_session = await self.identity_service.get_current_user_session()

        if user_session is None:
            return fail(CustomException("User has no session"))

        result = await self._refresh_tokens(user_session)

        user_proxy_result = await self._fetch_user_proxy(result)
        user_permissions_result = await self._fetch_user_permissions(result)

        result = succeed(user_session)
        result = self._update_user_proxy(result, user_proxy_result)
        result = self._update_user_permissions(result, user_permissions_result)
        result = await self._save_session(result)
        result = await self._persist_user(result)

        return result

    async def _refresh_tokens(
        self,
        user_session: RedisSessionDto,
    ) -> Result[RedisSessionDto]:

        if not auth_utils.is_token_expired(user_session.tokens.access_token):
            return succeed(user_session)

        if auth_utils.is_token_expired(user_session.tokens.refresh_token):
            return fail(UnauthorizedException("Token expired"))

        response = await self.api_client.refresh_token(user_session.tokens.refresh_token)
        tokens_result = auth_utils.resolve_token_response(response)
        
        if isinstance(tokens_result, Failure):
            return Failure(tokens_result.error)

        user_session.tokens = tokens_result.unwrap()
        return succeed(user_session)

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
        self, user_session: Result[RedisSessionDto]
    ) -> Result[UserProxyDto]:
        if isinstance(user_session, Failure):
            return Failure(user_session.error)

        session = user_session.unwrap()

        access_token = session.tokens.access_token
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
        self, user_session: Result[RedisSessionDto]
    ) -> Result[list[ShortPermissionDto]]:
        if isinstance(user_session, Failure):
            return Failure(user_session.error)

        session = user_session.unwrap()

        access_token = session.tokens.access_token
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
        expires_in = rt_data.exp - int(datetime.now(timezone.utc).timestamp())

        session_key = AuthCacheKeyGenerator.session(session.id)

        await self.redis.set(
            session_key,
            session.model_dump_json(),
            expires_in,
        )

        # Gets captured by SessionCookieSyncMiddleware
        self.identity_service.request.state.refresh_session_cookies = (
            session.id,
            expires_in,
        )

        return user_session

    async def _persist_user(
        self, user_session: Result[RedisSessionDto]
    ) -> Result[RedisSessionDto]:
        if isinstance(user_session, Failure):
            return user_session

        session = user_session.unwrap()

        if not session.profile:
            return fail(CustomException("No profile on user session"))

        user_model = User(
            id=session.profile.id,
            username=session.profile.username or "Unnamed User",
        )
        _ = await self.repo.upsert(user_model)
        return user_session
