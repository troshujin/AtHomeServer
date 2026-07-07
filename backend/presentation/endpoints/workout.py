import uuid
from typing import Annotated

from fastapi import APIRouter, Depends

from application.gym.dto import FetchWorkoutFilters, MutateWorkoutDto, WorkoutDto
from application.gym.usecases.create_workout import CreateWorkoutUseCase
from application.gym.usecases.delete_workout import DeleteWorkoutUseCase
from application.gym.usecases.get_promoted_workouts import GetPromotedWorkoutsUseCase
from application.gym.usecases.get_workout import GetWorkoutUseCase
from application.gym.usecases.get_workouts import GetWorkoutsUseCase
from application.gym.usecases.update_workout import UpdateWorkoutUseCase
from core.common.schema import BaseSearchQuery, Page
from core.decorators.auth_permissions import IsAuthenticated
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response

router = APIRouter(prefix="/workouts")


@router.get("", response_model=Page[WorkoutDto])
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_list(
    filters: Annotated[FetchWorkoutFilters, Depends()],
    use_case: Annotated[GetWorkoutsUseCase, Depends()],
):
    return await use_case(filters)


# Registered before /{workout_id} - a uuid.UUID path param would otherwise
# still match the literal segment "promoted" first (Starlette matches by
# registration order, not by literal-vs-param specificity) and fail trying
# to parse "promoted" as a UUID instead of ever reaching this route.
@router.get("/promoted", response_model=Page[WorkoutDto])
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_promoted(
    filters: Annotated[BaseSearchQuery, Depends()],
    use_case: Annotated[GetPromotedWorkoutsUseCase, Depends()],
):
    return await use_case(filters)


@router.get("/{workout_id}", response_model=WorkoutDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def get_single(workout_id: uuid.UUID, use_case: Annotated[GetWorkoutUseCase, Depends()]):
    return await use_case(workout_id)


@router.post("", response_model=WorkoutDto, status_code=201)
@resolve_response(201)
@require_permission(IsAuthenticated)
async def create(payload: MutateWorkoutDto, use_case: Annotated[CreateWorkoutUseCase, Depends()]):
    return await use_case(payload)


@router.put("/{workout_id}", response_model=WorkoutDto)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def update(
    workout_id: uuid.UUID,
    payload: MutateWorkoutDto,
    use_case: Annotated[UpdateWorkoutUseCase, Depends()],
):
    return await use_case(workout_id, payload)


@router.delete("/{workout_id}", status_code=200)
@resolve_response(200)
@require_permission(IsAuthenticated)
async def delete(workout_id: uuid.UUID, use_case: Annotated[DeleteWorkoutUseCase, Depends()]):
    return await use_case(workout_id)
