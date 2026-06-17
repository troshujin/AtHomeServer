from fastapi import Depends
from typing import override, final, Annotated

from application.auth.services.identity import IdentityService
from core.common.result import Result, fail, succeed
from core.decorators.auth_permissions._base import BasePermission
from core.exceptions.standard import UnauthenticatedException, UnauthorizedException
from infrastructure.trojonetworks.consts.permissions import TrojoNetworkPermissions


@final
class IsAdmin(BasePermission):
    def __init__(self, identity_service: Annotated[IdentityService, Depends()]) -> None:
        super().__init__()
        self.identity_service = identity_service

    @override
    async def has_permission(self) -> Result[bool]:
        current_user = await self.identity_service.get_current_user_session()

        if current_user is None:
            return fail(UnauthenticatedException())

        for permission in current_user.permissions:
            if permission.name == TrojoNetworkPermissions.administrator:
                break
        else:
            return fail(UnauthorizedException())

        return succeed(True)
