from typing import ClassVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class AuthorizationRequestDto(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    client_id: str
    code_challenge: str
    state: str
    back: str


class TokenRequestDto(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    code: str
    code_verifier: str
    client_id: str


class TokensDto(BaseModel):
    access_token: str = Field(alias="accessToken")
    refresh_token: str = Field(alias="refreshToken")

    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)


class AccessTokenPayloadDto(BaseModel):
    aud: str
    exp: int
    iat: int
    iss: str
    jti: str
    name: str
    nbf: int
    uid: str
    AccessIncomplete: str | None = None


class RefreshTokenPayloadDto(BaseModel):
    aud: str
    exp: int
    iat: int
    iss: str
    jti: str
    uid: str
