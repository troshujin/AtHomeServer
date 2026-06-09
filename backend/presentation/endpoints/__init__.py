from fastapi import APIRouter

from .files import router as files_router
from .auth import router as auth_router
from .workout import router as workout_router

router = APIRouter(prefix="/api")


router.include_router(files_router)
router.include_router(auth_router)
router.include_router(workout_router)


__all__ = ["router"]
