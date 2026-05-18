import base64
import hashlib
import json
import os
import time

from web.trojonetworks.dtos.auth import AccessTokenPayloadDto, RefreshTokenPayloadDto


def _decode_token(token: str) -> dict[str, str]:
    payload_b64 = token.split(".")[1]
    payload_b64 += "=" * (-len(payload_b64) % 4)
    payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
    return json.loads(payload_json)


def decode_jwt(token: str) -> AccessTokenPayloadDto:
    try:
        raw_payload = _decode_token(token)
        print("raw_payload", raw_payload)
        return AccessTokenPayloadDto.model_validate(raw_payload)

    except Exception as exc:
        print("Exception at decode_jwt")
        print(exc)
        raise ValueError("Invalid JWT token")


def decode_refresh_jwt(token: str) -> RefreshTokenPayloadDto:
    try:
        raw_payload = _decode_token(token)
        print("raw_payload refresh", raw_payload)
        return RefreshTokenPayloadDto.model_validate(raw_payload)

    except Exception as exc:
        print("Exception at decode_refresh_jwt")
        print(exc)
        raise ValueError("Invalid JWT token")


def is_token_expired(token: str) -> bool:
    try:
        payload = decode_jwt(token)
        return time.time() > (payload.exp - 5)
    except Exception:
        return True


def generate_code_verifier() -> str:
    token = os.urandom(32)
    return base64.urlsafe_b64encode(token).decode("utf-8").rstrip("=")


def generate_code_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")
