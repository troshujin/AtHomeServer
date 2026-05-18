from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from application.files.controller import FileController
from application.files.dto import FileDto

router = APIRouter(prefix="/files")

@router.get("", response_model=list[FileDto])
async def get_files(controller: Annotated[FileController, Depends()]):
    return await controller.get_all_files()


@router.get("cheese", response_model=list[FileDto])
async def get_cheese():
    return JSONResponse(
        status_code=500,
        content={"msg": "hello!"}
    )
