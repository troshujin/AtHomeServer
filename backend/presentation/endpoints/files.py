from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from application.files.dto import FileDto
from application.files.service import FileService

router = APIRouter(prefix="/files")

@router.get("", response_model=list[FileDto])
async def get_files(service: Annotated[FileService, Depends()]):
    return await service.get_files()


@router.get("cheese", response_model=list[FileDto])
async def get_cheese():
    return JSONResponse(
        status_code=500,
        content={"msg": "hello!"}
    )
