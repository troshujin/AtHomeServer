import secrets


class ShortUrlKeyGenerator:
    @staticmethod
    def new_hash() -> str:
        # 6 bytes -> 8 url-safe chars: short enough for a low-density QR,
        # random enough (2^48) that guessing within the 30-minute TTL isn't
        # a realistic concern.
        return secrets.token_urlsafe(6)

    @staticmethod
    def short_url(url_hash: str) -> str:
        return f"shorturl_{url_hash}"
