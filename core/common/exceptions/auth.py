from core.common.exception import CustomException


class UnauthorizedException(CustomException):
    message: str = "User is not authenticated."
    code: str = "UNAUTHORIZED_ERROR"
    http_code: int = 401
