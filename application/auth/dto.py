from pydantic import BaseModel


class AuthCallbackDto(BaseModel):
    code: str
    state: str
