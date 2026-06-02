import secrets
import uuid


class AuthCacheKeyGenerator:
    @staticmethod
    def new_id() -> str:
        return str(uuid.uuid4())

    @staticmethod
    def rdn_key() -> str:
        return secrets.token_urlsafe(32)

    @staticmethod
    def session(identifier: str):
        return f"session_{identifier}"

    @staticmethod
    def login_process(identifier: str):
        return f"lgpc_{identifier}"
