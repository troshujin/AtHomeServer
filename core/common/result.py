from dataclasses import dataclass
from collections.abc import Callable

from core.common.exception import CustomException

@dataclass(slots=True)
class Ok[T, E = CustomException]:
    value: T

    def map[U](self, f: Callable[[T], U]) -> "Result[U, E]":
        return Ok(f(self.value))

    def bind[U](self, f: Callable[[T], "Result[U, E]"]) -> "Result[U, E]":
        return f(self.value)

    def unwrap_or[U](self, default: U) -> T | U:  # pyright: ignore[reportUnusedParameter]
        return self.value


@dataclass(slots=True)
class Err[T, E = CustomException]:
    error: E

    def map[U](self, f: Callable[[T], U]) -> "Result[U, E]":  # pyright: ignore[reportUnusedParameter]
        return Err[U, E](self.error)

    def bind[U](self, f: Callable[[T], "Result[U, E]"]) -> "Result[U, E]":  # pyright: ignore[reportUnusedParameter]
        return Err[U, E](self.error)

    def unwrap_or[U](self, default: U) -> T | U:
        return default


type Result[T, E = CustomException] = Ok[T, E] | Err[T, E]


def ok[T, E = CustomException](value: T) -> Result[T, E]:
    return Ok[T, E](value)


def err[T, E = CustomException](error: E) -> Result[T, E]:
    return Err[T, E](error)
