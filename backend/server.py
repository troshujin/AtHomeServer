import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from core.exceptions.base import CustomException
from presentation.endpoints import router

logger = logging.getLogger("uvicorn.error")


def create_app() -> FastAPI:
    app = FastAPI(
        title="AtHomeServer API",
        description="My local home server backend",
        version="0.1.0",
        docs_url="/docs",
        openapi_url="/openapi.json",
    )

    app.include_router(router)

    @app.exception_handler(CustomException)
    async def _(_: Request, exc: CustomException):
        # logger.error(f"Unhandled CustomException:\n{exc.get_trace()}")
        response = JSONResponse(
            status_code=exc.http_code,
            content=exc.to_dict(),
        )

        if exc.http_code == 401 or exc.http_code == 403:
            response.delete_cookie("session_id")

        return response

    return app


app = create_app()
