from typing import Annotated

from fastapi import Depends

from application.files.dto import FileDto
from application.files.service import FileService
from core.common.bases import BaseController
from core.common.decorators import resolve_response
from core.common.result import Result


class FileController(BaseController):
    service: FileService

    def __init__(self, service: Annotated[FileService, Depends()]):
        self.service = service

    @resolve_response(200)
    async def get_all_files(self) -> Result[list[FileDto]]:
        raw_files = await self.service.get_files()

        return raw_files.map(FileDto.from_my_file_list)

    @resolve_response(201)
    async def get_cheese(self) -> Result[list[FileDto]]:
        raw_files = await self.service.get_files()

        return raw_files.map(FileDto.from_my_file_list)
