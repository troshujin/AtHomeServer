import functools
from collections.abc import Callable, Coroutine
from typing import ParamSpec, TypeVar
from fastapi.responses import JSONResponse

from core.decorators.auth_permissions._base import BasePermission
from core.common.result import Failure, Result
from core.exceptions.base import CustomException

P = ParamSpec("P")
T = TypeVar("T")


def require_permission(*perms: type[BasePermission]):

    def outer_wrapper(
        func: Callable[P, Coroutine[object, object, Result[T]]],
    ) -> Callable[P, Coroutine[object, object, Result[T] | JSONResponse]]:

        @functools.wraps(func)
        async def wrapper(*args: P.args, **kwargs: P.kwargs):
            errors: list[CustomException] = []
            for perm_cls in perms:
                result = await perm_cls().has_permission()
                if isinstance(result, Failure):
                    errors.append(result.error)

            if errors:
                first = errors[0]
                return JSONResponse(
                    status_code=first.http_code, content=first.to_dict()
                )
            return await func(*args, **kwargs)

        return wrapper

    return outer_wrapper
