from fastapi import APIRouter, Depends

from core.dependencies.authentication import UseAuthentication

from .files import router as files_router
from .auth import router as auth_router
from .workout import router as workout_router
from .me import router as me_router
from .short import router as short_router
from .user_relations import router as user_relations_router
from .users import router as users_router

router = APIRouter(
    prefix="/api",
    dependencies=[Depends(UseAuthentication())],
)


router.include_router(files_router, tags=["Files"])
router.include_router(auth_router, tags=["Auth"])
router.include_router(me_router, tags=["Me"])
router.include_router(workout_router, tags=["Workouts"])
router.include_router(user_relations_router, tags=["User relations"])
router.include_router(users_router, tags=["Users"])
router.include_router(short_router, tags=["Short URLs"])


__all__ = ["router"]
