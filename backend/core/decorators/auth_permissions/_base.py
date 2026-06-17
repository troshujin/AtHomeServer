from abc import ABC, abstractmethod

from core.common.result import Result


class BasePermission(ABC):
    @abstractmethod
    async def has_permission(self) -> Result[bool]:
        raise NotImplementedError("Should implement 'has_permission' function")
