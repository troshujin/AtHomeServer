import functools
from collections.abc import Callable, Coroutine
from typing import ParamSpec, TypeVar

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, RedirectResponse

from core.common.result import Err, Ok, Result

P = ParamSpec("P")
T = TypeVar("T")
Response = JSONResponse | RedirectResponse


def resolve_response(status_code: int = 200):
    def outer_wrapper(
        func: Callable[P, Coroutine[object, object, Result[T]]],
    ) -> Callable[P, Coroutine[object, object, Response]]:

        @functools.wraps(func)
        async def wrapper(*args: P.args, **kwargs: P.kwargs) -> Response:
            result = await func(*args, **kwargs)
            return handle_result(status_code, result)

        return wrapper
    return outer_wrapper


def handle_result(status_code: int, result: Result[T]) -> Response:
    match result:
        case Err(error=exc):
            return JSONResponse(status_code=exc.http_code, content=exc.to_dict())

        case Ok(value=val):
            if status_code == 303:
                return RedirectResponse(url=str(val), status_code=303)

            return JSONResponse(status_code=status_code, content=jsonable_encoder(val))
