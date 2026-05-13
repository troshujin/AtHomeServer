from random import random
from application.files.dto import MyFile
from core.common.exception import CustomException
from core.common.result import Result, err, ok


MY_FILES = [
    {
        "id": "1",
        "name": "My File 1",
        "internal_value": "ass",
    },
    {
        "id": "2",
        "name": "My File 2",
        "internal_value": "ass",
    },
    {
        "id": "3",
        "name": "My File 3",
        "internal_value": "ass",
    }
]


class FileService():
    def __init__(self) -> None:
        pass

    async def get_files(self) -> Result[list[MyFile]]:
        if random() > 0.6:
            return err(CustomException("mama mia"))

        files = [MyFile(**file) for file in MY_FILES]
        return ok(files)
