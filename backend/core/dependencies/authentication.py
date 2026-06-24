import inspect
from typing import cast
from contextlib import AsyncExitStack
from fastapi import Request
from fastapi.dependencies.utils import (
    get_dependant,
    solve_dependencies,
    SolvedDependency,
)
from core.decorators.auth_permissions._base import BasePermission
from core.common.result import Failure
from core.exceptions.base import CustomException


def _make_factory(perm_cls: type[BasePermission]):
    """Create a factory function with perm_cls.__init__'s signature (minus self),
    so FastAPI's get_dependant can correctly resolve its dependencies."""
    sig = inspect.signature(perm_cls.__init__)
    params = [p for name, p in sig.parameters.items() if name != "self"]

    async def factory(**kwargs: object) -> BasePermission:
        return perm_cls(**kwargs)

    factory.__signature__ = sig.replace(parameters=params)  # pyright: ignore[reportFunctionMemberAccess]  # ty:ignore[unresolved-attribute]
    return factory


class UseAuthentication:
    async def __call__(self, request: Request) -> None:
        endpoint = request.scope.get("endpoint")
        perms: tuple[type[BasePermission], ...] = getattr(
            endpoint, "__permissions__", ()
        )

        if not perms:
            return

        async_exit_stack = cast(AsyncExitStack, request.scope["fastapi_inner_astack"])
        errors: list[CustomException] = []

        for perm_cls in perms:
            instance = await self._resolve(perm_cls, request, async_exit_stack)
            result = await instance.has_permission()
            if isinstance(result, Failure):
                errors.append(result.error)

        if errors:
            raise errors[0]

    async def _resolve(
        self,
        perm_cls: type[BasePermission],
        request: Request,
        async_exit_stack: AsyncExitStack,
    ) -> BasePermission:
        factory = _make_factory(perm_cls)
        dependant = get_dependant(
            path=cast(str, request.scope["path"]),
            call=factory,
        )
        solved: SolvedDependency = await solve_dependencies(
            request=request,
            dependant=dependant,
            async_exit_stack=async_exit_stack,
            embed_body_fields=False,
        )
        if solved.errors:
            raise ValueError(
                f"Could not resolve dependencies for {perm_cls.__name__}: {solved.errors}"
            )
        return perm_cls(**solved.values)
