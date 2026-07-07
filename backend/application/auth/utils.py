from httpx import Response
import base64
import hashlib
import json
import os
import time
from typing import cast

from pydantic import ValidationError

from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from infrastructure.trojonetworks.dtos.auth import (
    AccessTokenPayloadDto,
    RefreshTokenPayloadDto,
    SharedTokenPayloadDto,
    TokensDto,
)


def _decode_token(token: str) -> dict[str, str]:
    payload_b64 = token.split(".")[1]
    payload_b64 += "=" * (-len(payload_b64) % 4)
    payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
    return cast(dict[str, str], json.loads(payload_json))


def decode_jwt(token: str) -> AccessTokenPayloadDto:
    try:
        raw_payload = _decode_token(token)
        return AccessTokenPayloadDto.model_validate(raw_payload)

    except Exception:
        raise ValueError("Invalid JWT token")


def decode_shared_jwt(token: str) -> SharedTokenPayloadDto:
    try:
        raw_payload = _decode_token(token)
        return SharedTokenPayloadDto.model_validate(raw_payload)

    except Exception:
        raise ValueError("Invalid JWT token")


def decode_refresh_jwt(token: str) -> RefreshTokenPayloadDto:
    try:
        raw_payload = _decode_token(token)
        return RefreshTokenPayloadDto.model_validate(raw_payload)

    except Exception:
        raise ValueError("Invalid JWT token")


def is_token_expired(token: str) -> bool:
    try:
        payload = decode_shared_jwt(token)
        return time.time() > (payload.exp - 5)
    except Exception:
        return True


def generate_code_verifier() -> str:
    token = os.urandom(32)
    return base64.urlsafe_b64encode(token).decode("utf-8").rstrip("=")


def generate_code_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")


def resolve_token_response(response: Response) -> Result[TokensDto]:
    if response.status_code != 200:
        return fail(CustomException("Failed to exchange code for tokens.", response.status_code))

    token_data = cast(dict[str, str], response.json())
    refresh_cookie = response.cookies.get("refreshToken")

    if not refresh_cookie:
        return fail(CustomException("Refresh token was not provided"))

    token_data["refreshToken"] = refresh_cookie

    try:
        tokens = TokensDto.model_validate(token_data)
    except ValidationError:
        return fail(CustomException("Response from authentication server was invalid"))

    return succeed(tokens)
