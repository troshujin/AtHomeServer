from typing import Self

from pydantic import BaseModel


class MyFile(BaseModel):
    id: str
    name: str
    internal_value: str


class FileDto(BaseModel):
    id: str
    name: str

    @classmethod
    def from_my_file(cls, data: MyFile) -> Self:
        return cls(id=data.id, name=data.name)

    @classmethod
    def from_my_file_list(cls, data: list[MyFile]) -> list[Self]:
        return [cls(id=f.id, name=f.name) for f in data]
