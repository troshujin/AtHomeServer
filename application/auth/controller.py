import functools
from typing import Annotated

from fastapi import Depends

from application.auth.dto import AuthLoginResultDto
from application.auth.service import AuthService
from core.common.bases import BaseController
from core.common.decorators import resolve_response
from core.common.exception import CustomException
from core.common.result import Result, err, ok


@functools.lru_cache
def get_auth_service() -> AuthService:
    return AuthService()


class AuthController(BaseController):
    service: AuthService

    def __init__(self, service: Annotated[AuthService, Depends(get_auth_service)]):
        self.service = service

    @resolve_response(303)
    async def callback(self, code: str, state: str) -> Result[str]:
        try:
            result = await self.service.callback(code, state)
            return ok(result.redirect_url)
        except CustomException as exc:
            return err(exc)
        except Exception as exc:
            return err(CustomException(message=str(exc)))

    @resolve_response(303)
    async def login(self) -> Result[str]:
        try:
            result = await self.service.login()
            return ok(result.redirect_url)
        except CustomException as exc:
            return err(exc)
        except Exception as exc:
            return err(CustomException(message=str(exc)))
