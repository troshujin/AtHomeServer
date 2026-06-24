from typing import Annotated

from fastapi import APIRouter, Depends

from application.gym.dto import FetchWorkoutFilters, MutateWorkoutDto, WorkoutDto
from application.gym.usecases.create_workout import CreateWorkoutUseCase
from application.gym.usecases.get_workouts import GetWorkoutsUseCase
from core.decorators.auth_permissions import IsAuthenticated
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response

router = APIRouter(prefix="/workouts")


@router.get("", response_model=list[WorkoutDto])
@resolve_response(200)
async def get_list(use_case: Annotated[GetWorkoutsUseCase, Depends()]):
    filters = FetchWorkoutFilters()
    return await use_case(filters)


@router.post("", response_model=WorkoutDto, status_code=201)
@resolve_response(201)
@require_permission(IsAuthenticated)
async def create(payload: MutateWorkoutDto, use_case: Annotated[CreateWorkoutUseCase, Depends()]):
    return await use_case(payload)
