import traceback
from typing import override


class CustomException(Exception):
    message: str = "An unexpected server error occurred."
    code: str = "INTERNAL_SERVER_ERROR"
    http_code: int = 500

    details: dict[str, object]

    def __init__(
        self, message: str | None = None, details: dict[str, object] | None = None
    ) -> None:
        if message:
            self.message = message

        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self) -> dict[str, object]:
        payload: dict[str, object] = {
            "code": self.code,
            "message": self.message,
        }
        if self.details:
            payload["details"] = self.details

        return payload

    @override
    def __str__(self) -> str:
        return f"[{self.code}] {self.message}"

    def get_trace(self) -> str:
        trace_list = traceback.format_exception(type(self), self, self.__traceback__)
        return "".join(trace_list)