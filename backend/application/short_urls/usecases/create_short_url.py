from urllib.parse import urlparse

from application.short_urls.dto import (
    ALLOWED_METHODS,
    SHORT_URL_TTL_SECONDS,
    CreateShortUrlDto,
    ShortUrlDto,
    StoredShortUrlDto,
)
from core.common.result import Result, fail, succeed
from core.configuration import config
from core.exceptions.base import CustomException
from infrastructure.cache.keygen.short_url import ShortUrlKeyGenerator
from infrastructure.cache.redis.service import RedisSessionService


def base_domain(hostname: str) -> str:
    """The registrable part of a hostname: last two labels ("gym.example.com"
    -> "example.com"), or the whole thing for single-label hosts
    ("localhost"). Ports are stripped before comparison."""
    host = hostname.split(":")[0].lower()
    labels = host.split(".")
    return host if len(labels) < 2 else ".".join(labels[-2:])


class CreateShortUrlUseCase:
    """
    Mints a 30-minute short link for a same-domain URL. The shortener is an
    open-redirect risk if it accepts arbitrary targets, so the URL's base
    domain must match the app's own (subdomains are fine, other domains are
    not). The stored value is method + url; resolution lives in
    ResolveShortUrlUseCase.
    """

    def __init__(self) -> None:
        self.redis: RedisSessionService = RedisSessionService()

    async def __call__(self, payload: CreateShortUrlDto) -> Result[ShortUrlDto]:
        method = payload.method.upper()
        if method not in ALLOWED_METHODS:
            return fail(CustomException(f"Unsupported method: {payload.method}", http_code=400))

        parsed = urlparse(payload.url)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            return fail(CustomException("Not a valid absolute URL", http_code=400))

        if base_domain(parsed.hostname) != base_domain(config.auth.DOMAIN):
            return fail(
                CustomException("Only URLs on this app's own domain can be shortened", http_code=400)
            )

        url_hash = ShortUrlKeyGenerator.new_hash()
        stored = StoredShortUrlDto(method=method, url=payload.url)

        await self.redis.set(
            ShortUrlKeyGenerator.short_url(url_hash),
            stored.model_dump_json(),
            SHORT_URL_TTL_SECONDS,
        )

        return succeed(
            ShortUrlDto(
                hash=url_hash,
                short_url=f"{config.auth.CURRENT_URL}/short/{url_hash}",
                expires_in_seconds=SHORT_URL_TTL_SECONDS,
            )
        )
