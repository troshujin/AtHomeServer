import uuid
from typing import Annotated

from fastapi import APIRouter, Depends

from application.user_relations.dto import BlockedUserDto, UserRelationDto, UserRelationsDto
from application.user_relations.usecases.accept_relation import AcceptRelationUseCase
from application.user_relations.usecases.block_user import BlockUserUseCase
from application.user_relations.usecases.delete_relation import DeleteRelationUseCase
from application.user_relations.usecases.get_blocks import GetBlocksUseCase
from application.user_relations.usecases.get_relations import GetRelationsUseCase
from application.user_relations.usecases.request_friend import RequestFriendUseCase
from application.user_relations.usecases.unblock_user import UnblockUserUseCase
from core.decorators.auth_permissions import IsAuthenticated
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response

router = APIRouter(prefix="/user_relations")


@router.get("", response_model=UserRelationsDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_relations(use_case: Annotated[GetRelationsUseCase, Depends()]):
    return await use_case()


# Literal-path routes registered before /{relation_id} routes - Starlette
# matches by registration order, not literal-vs-param specificity (same
# reasoning as /workouts/promoted).
@router.get("/blocks", response_model=list[BlockedUserDto])
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_blocks(use_case: Annotated[GetBlocksUseCase, Depends()]):
    return await use_case()


@router.post("/blocks/{user_id}", response_model=BlockedUserDto, status_code=201)
@resolve_response(201)
@require_permission(IsAuthenticated)
async def block_user(user_id: uuid.UUID, use_case: Annotated[BlockUserUseCase, Depends()]):
    return await use_case(user_id)


@router.delete("/blocks/{user_id}", status_code=200)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def unblock_user(user_id: uuid.UUID, use_case: Annotated[UnblockUserUseCase, Depends()]):
    return await use_case(user_id)


@router.post("/friends/{user_id}", response_model=UserRelationDto, status_code=201)
@resolve_response(201)
@require_permission(IsAuthenticated)
async def request_friend(user_id: uuid.UUID, use_case: Annotated[RequestFriendUseCase, Depends()]):
    return await use_case(user_id)


@router.post("/{relation_id}/accept", response_model=UserRelationDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def accept_relation(
    relation_id: uuid.UUID,
    use_case: Annotated[AcceptRelationUseCase, Depends()],
):
    return await use_case(relation_id)


@router.delete("/{relation_id}", status_code=200)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def delete_relation(
    relation_id: uuid.UUID,
    use_case: Annotated[DeleteRelationUseCase, Depends()],
):
    return await use_case(relation_id)
