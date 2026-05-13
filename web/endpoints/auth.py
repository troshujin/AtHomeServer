from typing import Annotated

from fastapi import APIRouter, Depends

from application.files.controller import FileController

router = APIRouter(prefix="/auth")


@router.get("/callback", response_model=None)
async def get_files(controller: Annotated[FileController, Depends()]):
    return await controller.get_all_files()
