from typing import Annotated

from fastapi import APIRouter, Depends

from application.auth.usecases.get_current_user import GetCurrentUserUseCase
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response
from core.decorators.auth_permissions import IsAuthenticated
from infrastructure.trojonetworks.dtos.user import UserProxyDto

router = APIRouter(prefix="/me")


@router.get(
    "",
    response_model=UserProxyDto,
)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def me(use_case: Annotated[GetCurrentUserUseCase, Depends()]):
    return await use_case()
