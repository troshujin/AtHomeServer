from typing import Annotated

from fastapi import APIRouter, Depends

from application.gym.dto import FetchWorkoutFilters, MutateWorkoutDto, WorkoutDto
from application.gym.usecases.create_workout import CreateWorkoutUseCase
from application.gym.usecases.get_workouts import GetWorkoutsUseCase
from core.decorators.response import resolve_response

router = APIRouter(prefix="/workouts")


@router.get("", response_model=list[WorkoutDto])
@resolve_response(200)
async def get_list(use_case: Annotated[GetWorkoutsUseCase, Depends()]):
    filters = FetchWorkoutFilters()
    return await use_case(filters)


@router.post("", response_model=WorkoutDto)
@resolve_response(201)
async def create(payload: MutateWorkoutDto, use_case: Annotated[CreateWorkoutUseCase, Depends()]):
    return await use_case(payload)
