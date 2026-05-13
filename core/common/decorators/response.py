import functools
from collections.abc import Callable, Coroutine
from typing import ParamSpec, TypeVar

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from core.common.result import Err, Ok, Result

# ParamSpec captures the *args and **kwargs signature of the target function
P = ParamSpec("P")
# success type
T = TypeVar("T")


def resolve_response(status_code: int = 200):
    def outer_wrapper(
        func: Callable[P, Coroutine[object, object, Result[T]]],
    ) -> Callable[P, Coroutine[object, object, JSONResponse]]:
        @functools.wraps(func)
        async def wrapper(*args: P.args, **kwargs: P.kwargs) -> JSONResponse:
            result = await func(*args, **kwargs)
            val: T

            match result:
                case Err(error=exc):
                    return JSONResponse(
                        status_code=exc.http_code, content=exc.to_dict()
                    )

                case Ok(value=val):
                    return JSONResponse(
                        status_code=status_code, content=jsonable_encoder(val)
                    )

        return wrapper

    return outer_wrapper
