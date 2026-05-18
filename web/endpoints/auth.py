from typing import Annotated

from fastapi import APIRouter, Depends

from application.auth.controller import AuthController

router = APIRouter(prefix="/auth")


@router.get("/callback", response_model=None)
async def callback(
    code: str,
    state: str,
    controller: Annotated[AuthController, Depends()],
):
    return await controller.callback(code, state)


@router.get("/login", response_model=None)
async def login(controller: Annotated[AuthController, Depends()]):
    return await controller.login()
