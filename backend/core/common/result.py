from collections.abc import Callable
from dataclasses import dataclass
import inspect

from core.exceptions.base import CustomException


# 1. Removed '= CustomException' from the class definition
@dataclass(slots=True, frozen=True)
class Success[T, E]:
    value: T

    @property
    def is_success(self) -> bool:
        return True

    @property
    def is_failure(self) -> bool:
        return False

    def map[U](self, f: Callable[[T], U]) -> "Result[U, E]":
        # 2. Explicitly pass [U, E] so it doesn't guess
        return Success[U, E](f(self.value))

    def bind[U](self, f: Callable[[T], "Result[U, E]"]) -> "Result[U, E]":
        return f(self.value)

    def unwrap(self) -> T:
        return self.value

    def unwrap_or[U](self, default: U) -> T | U:  # pyright: ignore[reportUnusedParameter]
        return self.value


# 3. Removed '= CustomException' here too
@dataclass(slots=True, frozen=True)
class Failure[T, E]:
    error: E

    @property
    def is_success(self) -> bool:
        return False

    @property
    def is_failure(self) -> bool:
        return True

    def map[U](self, f: Callable[[T], U]) -> "Result[U, E]":  # pyright: ignore[reportUnusedParameter]
        return Failure[U, E](self.error)

    def bind[U](self, f: Callable[[T], "Result[U, E]"]) -> "Result[U, E]":  # pyright: ignore[reportUnusedParameter]
        return Failure[U, E](self.error)

    def unwrap(self) -> T:
        if isinstance(self.error, Exception):
            raise self.error
        raise ValueError(f"Unwrapped a Failure: {self.error}")

    def unwrap_or[U](self, default: U) -> T | U:
        return default


type Result[T, E = CustomException] = Success[T, E] | Failure[T, E]


def succeed[T, E = CustomException](value: T) -> Result[T, E]:
    return Success[T, E](value)


def fail[T](error: CustomException) -> Result[T, CustomException]:
    file_name = "unknown"
    line_number = 0

    current_frame = inspect.currentframe()

    if current_frame is not None and current_frame.f_back is not None:
        caller_frame = current_frame.f_back

        frame_info = inspect.getframeinfo(caller_frame)

        file_name = frame_info.filename
        line_number = frame_info.lineno

    print(f"Fail caught in {file_name[1:]}:{line_number} with '{error.message}'")
    return Failure[T, CustomException](error)