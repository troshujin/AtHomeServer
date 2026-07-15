from urllib.parse import quote

from pydantic import ValidationError
from starlette.responses import RedirectResponse

from application.short_urls.dto import StoredShortUrlDto
from core.common.result import Result, fail, succeed
from core.configuration import config
from core.exceptions.base import CustomException
from infrastructure.cache.keygen.short_url import ShortUrlKeyGenerator
from infrastructure.cache.redis.service import RedisSessionService


class ResolveShortUrlUseCase:
    """
    Resolves /short/{hash} for a browser. An expired/unknown hash redirects
    to the frontend's error page with a readable message rather than
    returning bare JSON - the visitor is a person mid-QR-scan, not an API
    client. Non-GET stored methods can't be expressed as a browser redirect
    (a 3xx can't change the verb of the *next* request), so they're rejected
    loudly until something server-side (e.g. a proxying resolver) needs them.
    """

    def __init__(self) -> None:
        self.redis: RedisSessionService = RedisSessionService()

    async def __call__(self, url_hash: str) -> Result[RedirectResponse]:
        raw = await self.redis.get(ShortUrlKeyGenerator.short_url(url_hash))

        if raw is None:
            message = quote("This link has expired or doesn't exist. Ask for a fresh one!")
            return succeed(
                RedirectResponse(url=f"{config.auth.FRONTEND_URL}/error?q={message}")
            )

        try:
            stored = StoredShortUrlDto.model_validate_json(raw)
        except ValidationError:
            return fail(CustomException("Stored short link is corrupt"))

        if stored.method != "GET":
            return fail(
                CustomException(
                    f"Short links to {stored.method} targets can't be opened in a browser",
                    http_code=405,
                )
            )

        return succeed(RedirectResponse(url=stored.url, status_code=303))
