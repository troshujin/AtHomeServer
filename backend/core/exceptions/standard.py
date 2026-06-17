from .base import CustomException


class UnauthenticatedException(CustomException):
    message: str = "User is not authenticated."
    code: str = "UNAUTHENTICATED_ERROR"
    http_code: int = 401


class UnauthorizedException(CustomException):
    message: str = "User is not authorized."
    code: str = "UNAUTHORIZED_ERROR"
    http_code: int = 403


class NotFoundException(CustomException):
    message: str = "Not found."
    code: str = "NOT_FOUND"
    http_code: int = 404
