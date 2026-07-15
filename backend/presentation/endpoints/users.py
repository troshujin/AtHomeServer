import uuid
from typing import Annotated

from fastapi import APIRouter, Depends

from application.profile.dto import UserCardDto
from application.profile.usecases.get_user_card import GetUserCardUseCase
from core.decorators.auth_permissions import IsAuthenticated
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response

router = APIRouter(prefix="/users")


@router.get("/{user_id}/card", response_model=UserCardDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_user_card(user_id: uuid.UUID, use_case: Annotated[GetUserCardUseCase, Depends()]):
    return await use_case(user_id)
