from core.common.schema import APIBaseModel

# Stored methods are constrained to real HTTP verbs; today only GET targets
# can actually be resolved by a browser redirect (see ResolveShortUrlUseCase).
ALLOWED_METHODS: frozenset[str] = frozenset({"GET", "POST", "PUT", "PATCH", "DELETE"})

SHORT_URL_TTL_SECONDS: int = 30 * 60


class CreateShortUrlDto(APIBaseModel):
    url: str
    method: str = "GET"


class ShortUrlDto(APIBaseModel):
    hash: str
    short_url: str
    expires_in_seconds: int


class StoredShortUrlDto(APIBaseModel):
    """The Redis value behind a hash: what to send the visitor to, and how."""

    method: str
    url: str
