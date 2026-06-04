from application.auth.dto import AuthLoginDto
from core.common.result import Result, succeed


class CreateWorkoutUseCase:
    def __init__(self) -> None:
        self.identity_service = None

    async def __call__(self, payload: AuthLoginDto) -> Result[str]:
        return succeed("hello")
