from fastapi import Depends
from typing import override, final, Annotated

from application.auth.services.identity import IdentityService
from application.auth.usecases.validate_user_session import ValidateUserSessionUseCase
from core.common.result import Failure, Result, fail, succeed
from core.decorators.auth_permissions._base import BasePermission
from core.exceptions.standard import UnauthenticatedException


@final
class IsAuthenticated(BasePermission):
    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        validate_session: Annotated[ValidateUserSessionUseCase, Depends()],
    ) -> None:
        super().__init__()
        self.identity_service = identity_service
        self.validate_session = validate_session

    @override
    async def has_permission(self) -> Result[bool]:
        current_user = await self.identity_service.get_current_user_session()

        if current_user is None:
            return fail(UnauthenticatedException())

        validated = await self.validate_session(current_user)

        if isinstance(validated, Failure):
            return fail(validated.error)

        return succeed(True)
