from typing import Annotated

from fastapi import APIRouter, Depends

from application.short_urls.dto import CreateShortUrlDto, ShortUrlDto
from application.short_urls.usecases.create_short_url import CreateShortUrlUseCase
from application.short_urls.usecases.resolve_short_url import ResolveShortUrlUseCase
from core.decorators.auth_permissions import IsAuthenticated
from core.decorators.permission import require_permission
from core.decorators.response import resolve_response

router = APIRouter(prefix="/short")


@router.post("", response_model=ShortUrlDto, status_code=201)
@resolve_response(201)
@require_permission(IsAuthenticated)
async def create(
    payload: CreateShortUrlDto,
    use_case: Annotated[CreateShortUrlUseCase, Depends()],
):
    return await use_case(payload)


# Deliberately unauthenticated: the person opening a shared/QR link may not
# be logged in yet - the page behind the link enforces its own auth.
@router.get("/{url_hash}", response_model=None)
@resolve_response(303)
async def resolve(url_hash: str, use_case: Annotated[ResolveShortUrlUseCase, Depends()]):
    return await use_case(url_hash)
