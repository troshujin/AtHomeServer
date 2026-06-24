from collections.abc import Callable, Coroutine
from typing import ParamSpec, TypeVar

from core.decorators.auth_permissions._base import BasePermission
from core.common.result import Result

P = ParamSpec("P")
T = TypeVar("T")


def require_permission(*perms: type[BasePermission]):
    def decorator(
        func: Callable[P, Coroutine[object, object, Result[T]]],
    ) -> Callable[P, Coroutine[object, object, Result[T]]]:
        existing: tuple[type[BasePermission], ...] = getattr(
            func, "__permissions__", ()
        )
        setattr(func, "__permissions__", existing + perms)
        return func

    return decorator
