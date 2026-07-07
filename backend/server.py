from typing import override, cast
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response

from application.auth.cookies import clear_session_cookies, set_session_cookies
from core.configuration import config
from core.exceptions.base import CustomException
from presentation.endpoints import router

logger = logging.getLogger("uvicorn.error")


class SessionCookieSyncMiddleware(BaseHTTPMiddleware):
    """Applies whatever session-cookie change a usecase queued on
    `request.state` during this request to the actual outgoing response.

    Usecases that refresh or invalidate a session (IdentityService,
    RefreshUserSessionUseCase) have no response object of their own to set
    cookies on - by the time the real Response exists, they've already
    returned. Queuing the change on `request.state` and applying it here,
    once, after the whole request/dependency chain has run, is what lets the
    browser's session/hint cookies track the Redis-side session TTL instead
    of going stale at the lifetime fixed when the cookie was first issued.
    """

    @override
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)

        if getattr(request.state, "clear_session_cookies", False):
            clear_session_cookies(response)
        else:
            refresh = cast(
                tuple[str, int] | None,
                getattr(request.state, "refresh_session_cookies", None),
            )
            if refresh is not None:
                session_id, expires_in = refresh
                set_session_cookies(response, session_id, expires_in)

        return response


def create_app() -> FastAPI:
    app = FastAPI(
        title="AtHomeServer API",
        description="My local home server backend",
        version="0.1.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    app.include_router(router)

    app.add_middleware(SessionCookieSyncMiddleware)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[config.auth.FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(CustomException)
    async def _(_: Request, exc: CustomException):
        return JSONResponse(
            status_code=exc.http_code,
            content=exc.to_dict(),
        )

    return app


app = create_app()
