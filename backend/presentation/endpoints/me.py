from typing import Annotated

from fastapi import APIRouter, Depends

from application.auth.usecases.get_current_user import GetCurrentUserUseCase
from application.profile.dto import (
    MutateCardPrivacyDto,
    MutateProfileCardStatsDto,
    ProfileCardStatsDto,
    ProfileStatDto,
)
from application.profile.usecases.edit_profile import EditProfileUseCase
from application.profile.usecases.get_card_stats import GetCardStatsUseCase
from application.profile.usecases.get_profile_stats import GetProfileStatsUseCase
from application.profile.usecases.set_card_privacy import SetCardPrivacyUseCase
from application.profile.usecases.set_card_stats import SetCardStatsUseCase
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


@router.get("/edit", response_model=None)
@resolve_response(303)
@require_permission(IsAuthenticated)
async def edit_profile(use_case: Annotated[EditProfileUseCase, Depends()]):
    return await use_case()


@router.get("/stats", response_model=list[ProfileStatDto])
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_stats(use_case: Annotated[GetProfileStatsUseCase, Depends()]):
    return await use_case()


@router.get("/card-stats", response_model=ProfileCardStatsDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_card_stats(use_case: Annotated[GetCardStatsUseCase, Depends()]):
    return await use_case()


@router.put("/card-stats", response_model=ProfileCardStatsDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def set_card_stats(
    payload: MutateProfileCardStatsDto,
    use_case: Annotated[SetCardStatsUseCase, Depends()],
):
    return await use_case(payload)


@router.put("/card-privacy", response_model=ProfileCardStatsDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def set_card_privacy(
    payload: MutateCardPrivacyDto,
    use_case: Annotated[SetCardPrivacyUseCase, Depends()],
):
    return await use_case(payload)
