from typing import Annotated

from fastapi import APIRouter, Depends

from application.gym.dto import FetchWorkoutFilters
from application.gym.usecases.get_workouts import GetWorkoutsUseCase
from core.decorators.response import resolve_response

router = APIRouter(prefix="/workouts")


@router.get("", response_model=None)
@resolve_response(200)
async def get_list(use_case: Annotated[GetWorkoutsUseCase, Depends()]):
    filters = FetchWorkoutFilters()
    return await use_case(filters)
