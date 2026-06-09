from typing import Annotated

from fastapi import APIRouter, Depends

from application.auth.dto import AuthCallbackDto, AuthLoginDto
from application.auth.usecases.callback import AuthCallbackUseCase
from application.auth.usecases.login import AuthLoginUseCase
from core.decorators.response import resolve_response

router = APIRouter(prefix="/auth")


@router.get("/login", response_model=None)
@resolve_response(303)
async def login(use_case: Annotated[AuthLoginUseCase, Depends()]):
    payload = AuthLoginDto()
    return await use_case(payload)


@router.get("/callback", response_model=None)
@resolve_response(303)
async def callback(
    code: str,
    state: str,
    use_case: Annotated[AuthCallbackUseCase, Depends()],
):
    payload = AuthCallbackDto(
        code=code,
        state=state,
    )
    return await use_case(payload)
