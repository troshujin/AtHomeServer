from pydantic import BaseModel


class AuthCallbackDto(BaseModel):
    code: str
    state: str


class AuthCallbackResultDto(BaseModel):
    redirect_url: str
    session_id: str


class AuthLoginDto(BaseModel):
    redirect_url: str | None = None


class AuthLoginResultDto(BaseModel):
    redirect_url: str
