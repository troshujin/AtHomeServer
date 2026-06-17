from fastapi import APIRouter

from .files import router as files_router
from .auth import router as auth_router
from .workout import router as workout_router
from .me import router as me_router

router = APIRouter(prefix="")


router.include_router(files_router, tags=["Files"])
router.include_router(auth_router, tags=["Auth"])
router.include_router(me_router, tags=["Me"])
router.include_router(workout_router, tags=["Workouts"])


__all__ = ["router"]
